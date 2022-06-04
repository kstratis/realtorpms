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

  def new_listing(data)
    client.call("sync.newListing", SPITOGATOS_APP_KEY, 0, username, password, data)
  end

  def renew_listing(property_id)
    client.call("sync.renewListing", SPITOGATOS_APP_KEY, username, password, property_id.to_i)
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

  class << self

    # Takes each attribute of a given property and transforms it to spitogatos format
    def convert_to_spitogatos_format(property)
      Converters::SpitogatosConverter.new(property).convert!
    end

    def spitogatos_accounts
      # Get all accounts associated with an active spitogatos configuration record
      Account.joins(:spitogatos).where(spitogatos: { active: true })
    end

    def create_listings
      spitogatos_accounts.each do |account|
        # Fetch only spitogatos activated properties which are not on spitogatos portal
        properties = account.properties.where(spitogatos_sync: true)
        properties.each do |property|
          data = convert_to_spitogatos_format(property)
          spitogatos_id = account.spitogatos.new_listing(data)
          property.update(spitogatos_id: spitogatos_id, spitogatos_created_at: Time.current)
        end
      end
    end

    def edit_listings
      spitogatos_accounts.each do |account|
        # Fetch only spitogatos activated properties which have already been uploaded to spitogatos portal
        properties = account.properties.where(spitogatos_sync: true).where.not(spitogatos_id: nil)
        properties.each do |property|
          data = convert_to_spitogatos_format(property)
          account.spitogatos.edit_listing(property.spitogatos_id, data)
          property.update(spitogatos_updated_at: Time.current)
        end
      end
    end

    def renew_listings
      spitogatos_accounts.each do |account|
        # Fetch only spitogatos activated properties which have already been uploaded to spitogatos portal
        properties = account.properties.where(spitogatos_sync: true).where.not(spitogatos_id: nil)
        properties.each do |property|
          account.spitogatos.renew_listing(property.spitogatos_id)
          property.update(spitogatos_updated_at: Time.current)
        end
      end
    end

    def delete_listings
      spitogatos_accounts.each do |account|
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
