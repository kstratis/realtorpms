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

  def new_listing(data)  # OK
    client.call("sync.newListing", SPITOGATOS_APP_KEY, broker_id.to_s, username, password, data)
  end

  def renew_listing(property_spitogatos_id)  # OK
    client.call("sync.renewListing", SPITOGATOS_APP_KEY, username, password, property_spitogatos_id)
  end

  def edit_listing(property_id, data)
    client.call("sync.editListing", SPITOGATOS_APP_KEY, username, password, property_id.to_i, data)
  end

  def delete_listing(property_id)
    client.call("sync.deleteListing", SPITOGATOS_APP_KEY, username, password, property_id.to_i)
  end

  def new_dummy_listing
    client.call("sync.newListing", SPITOGATOS_APP_KEY, 0, username, password, SPITOGATOS_DUMMY_DATA)
  end

  def add_listing_image(property_spitogatos_id, slot, image_url)
    client.call("sync.addImage", SPITOGATOS_APP_KEY, username, password, property_spitogatos_id, slot, image_url)
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
      image_slots_count = @property.images.presence || 0
      if property.avatar.attached?
        image_slots_count += 1
      end

      image_slots_count.times.each.with_index(1) do |_, index|
        account.spitogatos.add_listing_image(property.spitogatos_id.to_i, index)
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
        logger.info "Found #{properties.size} new properties to sync"
        properties.each do |property|
          logger.info "Syncing property #{property.slug}/#{property.id}"
          data = convert_to_spitogatos_format(property)
          logger.info "Uploading property data"
          spitogatos_id = account.spitogatos.new_listing(data)
          property.update_columns(spitogatos_id: spitogatos_id, spitogatos_created_at: Time.current, spitogatos_updated_at: Time.current)
          logger.info "Uploading property images"
          upload_images(account, property)
        end
      end
    end

    def edit_listings
      spitogatos_enabled_accounts.each do |account|
        # Fetch only spitogatos activated properties which have already been uploaded to spitogatos portal
        data_sync_properties = account.properties.where(spitogatos_sync: true, spitogatos_data_sync_needed: true).where.not(spitogatos_id: nil)
        logger.info "Found #{properties.size} properties with data changes to sync"
        data_sync_properties.each do |property|
          data = convert_to_spitogatos_format(property)
          account.spitogatos.edit_listing(property.spitogatos_id, data)
          property.update_columns(spitogatos_updated_at: Time.current, spitogatos_data_sync_needed: false)
        end

        image_sync_properties = account.properties.where(spitogatos_sync: true, spitogatos_images_sync_needed: true).where.not(spitogatos_id: nil)
        logger.info "Found #{properties.size} properties with image changes to sync"
        image_sync_properties.each do |property|
          delete_images(account, property)
          upload_images(account, property)
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
          account.spitogatos.renew_listing(property.spitogatos_id.to_i)
          property.update(spitogatos_updated_at: Time.current)
        end
      end
    end

    def delete_listings
      spitogatos_enabled_accounts.each do |account|
        # Fetch only spitogatos de-activated properties which have already been uploaded to spitogatos portal
        properties = account.properties.where(spitogatos_sync: false).where.not(spitogatos_id: nil)
        properties.each do |property|
          account.spitogatos.delete_listing(property.spitogatos_id)
          property.update(spitogatos_id: nil, spitogatos_created_at: nil, spitogatos_updated_at: nil)
        end
      end
    end
  end
end
