class Spitogatos < ApplicationRecord
  belongs_to :account

  def check_connection
    dummy_property_id = new_dummy_listing
    logger.info "Dummy property created with id: #{dummy_property_id}"
    delete_listing dummy_property_id
    logger.info "Successfully deleted dummy property with id: #{dummy_property_id}"
    update(active: true)
    :active
  rescue StandardError => e
    logger.error "There has been an exception validating spitogatos credentials: #{e}"
    update(active: false)
    :inactive
  end

  def client
    @client ||= begin
      client = XMLRPC::Client.new2(SPITOGATOS_WEBSERVICE_URL)
      client.http_header_extra = { 'Content-Type' => 'text/xml' }
      client
    end
  end

  def new_dummy_listing
    client.call("sync.newListing", SPITOGATOS_APP_KEY, 0, username, password, SPITOGATOS_DUMMY_DATA)
  end

  def new_listing(data)
    client.call("sync.newListing", SPITOGATOS_APP_KEY, broker_id.to_s, username, password, data)
  end

  def renew_listing(property_spitogatos_id)
    client.call("sync.renewListing", SPITOGATOS_APP_KEY, username, password, property_spitogatos_id)
  end

  def edit_listing(property_id, data)
    client.call("sync.editListing", SPITOGATOS_APP_KEY, username, password, property_id.to_i, data)
  end

  def delete_listing(property_spitogatos_id)
    client.call("sync.deleteListing", SPITOGATOS_APP_KEY, username, password, property_spitogatos_id.to_i)
  end

  def add_listing_image(property_spitogatos_id, slot, image_url)
    client.call("sync.addImage", SPITOGATOS_APP_KEY, username, password, property_spitogatos_id, slot, image_url)
  end

  def get_image_list(property_spitogatos_id)
    client.call("sync.getImageList", SPITOGATOS_APP_KEY, username, password, property_spitogatos_id)
  end

  def remove_listing_image(property_spitogatos_id, slot)
    client.call("sync.deleteImage", SPITOGATOS_APP_KEY, username, password, property_spitogatos_id, slot)
  end

  class << self

    # Takes each attribute of a given property and transforms it to spitogatos format
    def convert_to_spitogatos_format(property)
      Converters::SpitogatosConverter.new(property).convert!
    end

    def delete_images(account, property)
      property_existing_images_list = account.spitogatos.get_image_list(property.spitogatos_id.to_i)
      return if property_existing_images_list.blank?

      property_image_slots = property_existing_images_list.keys

      property_image_slots.each do |slot|
        account.spitogatos.remove_listing_image(property.spitogatos_id.to_i, slot.to_i)
      end
    end

    def upload_images(account, property)
      slot_start = 1
      if property.avatar.attached?
        account.spitogatos.add_listing_image(property.spitogatos_id.to_i, slot_start, property.avatar.url)
        slot_start += 1
      end

      return if property.images.blank?

      property.images.each.with_index(slot_start) do |image, index|
        account.spitogatos.add_listing_image(property.spitogatos_id.to_i, index, image.url)
      end
    end

    def spitogatos_enabled_accounts
      # Get all -Greek- accounts associated with an active spitogatos configuration record
      Account.joins(:spitogatos).where(
        spitogatos: { active: true },
        accounts: { flavor: :greek }
      )
    end

    def create_listings
      spitogatos_enabled_accounts.each do |account|
        # Fetch only account properties on which:
        # 1) `spitogatos_sync` has been turned on
        # 2) `spitogatos_id` is `nil` meaning it's not registered against spitogatos yet
        properties = account.properties.where(spitogatos_sync: true, spitogatos_id: nil)
        logger.info "-=Found #{properties.size} new properties to sync=-"
        properties.each do |property|
          logger.info "-=Uploading new property #{property.slug}/#{property.id}=-"

          begin
            data = convert_to_spitogatos_format(property)
            spitogatos_id = account.spitogatos.new_listing(data)
          rescue StandardError => e
            logger.error "-=Error uploading new property #{property.slug}/#{property.id}: #{e}=-"
            next
          end

          property.update_columns(spitogatos_id: spitogatos_id, spitogatos_created_at: Time.current, spitogatos_updated_at: Time.current)

          begin
            upload_images(account, property)
          rescue StandardError => e
            logger.error "-=Error images for new property #{property.slug}/#{property.id}: #{e}=-"
          end
        end
      end
    end

    def edit_listings
      spitogatos_enabled_accounts.each do |account|
        # Fetch only spitogatos activated properties which have already been uploaded to spitogatos portal
        data_sync_properties = account.properties.where(spitogatos_sync: true, spitogatos_data_sync_needed: true).where.not(spitogatos_id: nil)

        logger.info "-=Found #{data_sync_properties.size} properties with data changes to sync=-"

        data_sync_properties.each do |property|
          logger.info "-=Updating data for property #{property.slug}/#{property.id}/#{property.spitogatos_id}=-"

          begin
            data = convert_to_spitogatos_format(property)
            account.spitogatos.edit_listing(property.spitogatos_id, data)
          rescue StandardError => e
            logger.error "-=Error updating data for property #{property.slug}/#{property.id}/#{property.spitogatos_id}: #{e}=-"
            next
          end

          property.update_columns(spitogatos_updated_at: Time.current, spitogatos_data_sync_needed: false)
        end

        image_sync_properties = account.properties.where(spitogatos_sync: true, spitogatos_images_sync_needed: true).where.not(spitogatos_id: nil)

        logger.info "-=Found #{image_sync_properties.size} properties with image changes to sync=-"

        image_sync_properties.each do |property|
          logger.info "-=Updating images for property #{property.slug}/#{property.id}/#{property.spitogatos_id}=-"

          begin
            delete_images(account, property)
            upload_images(account, property)
          rescue StandardError => e
            logger.error "-=Error updating images for property #{property.slug}/#{property.id}/#{property.spitogatos_id}: #{e}=-"
            next
          end

          property.update_columns(spitogatos_updated_at: Time.current, spitogatos_images_sync_needed: false)
        end
      end
    end

    def renew_listings
      spitogatos_enabled_accounts.each do |account|
        # Fetch only spitogatos activated properties which have already been uploaded to spitogatos portal
        properties = account.properties.where(spitogatos_sync: true).where.not(spitogatos_id: nil)

        logger.info "Found #{properties.size} properties to renew"

        properties.each do |property|
          begin
            account.spitogatos.renew_listing(property.spitogatos_id.to_i)
          rescue StandardError => e
            logger.error "-=Error renewing property #{property.slug}/#{property.id}/#{property.spitogatos_id}: #{e}=-"
            next
          end
          property.update(spitogatos_updated_at: Time.current)
        end
      end
    end

    def delete_listings
      spitogatos_enabled_accounts.each do |account|
        # Fetch only spitogatos de-activated properties which have already been uploaded to spitogatos portal
        properties = account.properties.where(spitogatos_sync: false).where.not(spitogatos_id: nil)

        logger.info "Found #{properties.size} properties to delete"

        properties.each do |property|
          begin
            account.spitogatos.delete_listing(property.spitogatos_id)
          rescue StandardError => e
            logger.error "-=Error deleting property #{property.slug}/#{property.id}/#{property.spitogatos_id}: #{e}=-"
            next
          end
          property.update_columns(spitogatos_id: nil, spitogatos_sync: false, spitogatos_created_at: nil, spitogatos_updated_at: nil, spitogatos_images_sync_needed: false, spitogatos_data_sync_needed: false)
        end
      end
    end
  end
end
