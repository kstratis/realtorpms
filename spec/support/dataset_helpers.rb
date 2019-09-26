require 'rails_helper'

module DatasetHelpers

  def use_regular_dataset

    @category = Category.create(localname: "Διαμέρισμα", globalname: "Apartment", level: 2, parent_id: 1, parent_localname: "Κατοικία", parent_globalname: "Residential", slug: "apartment", parent_slug: "residential")
    @location = Location.create(localname: "Λαμπρινή", globalname: "Lamprini", level: 3, parent_id: 2305, country_id: 1, parent_localname: "Γαλάτσι", parent_globalname: "Galatsi")
    # This creates one account and at the same time one special associated user (test1 - owner)
    @account1 = FactoryBot.create(:account)

    # This creates another account and at the same time one special associated user (test2 - owner)
    @account2 = FactoryBot.create(:account2)

    # This creates 4 regular users. In total we get 6 so far (the extra 2 are the default account owners).
    users = FactoryBot.create_list(:usersequence, 4)

    # Legacy
    # Users don't get assigned to accounts automatically. They need to be manually assigned
    # users.map { |user| @account1.users << user } # This maps all -regular- users (not the owner) to our single account as simple account users

    @account1.users << users.first
    @account1.users << users.second
    @account2.users << users.third
    @account2.users << users.fourth

    @account1_first_user = @account1.users.first
    @account1_second_user = @account1.users.second

    @account2_first_user = @account2.users.first
    @account2_second_user = @account2.users.second

    # This creates 20 properties. By default all properties are owned by the +test1+ account.
    # Check out the factory to verify.
    @account1_properties = FactoryBot.create_list(:propertysequence, 10, account: @account1, category: @category, location: @location)
    @account2_properties = FactoryBot.create_list(:propertysequence, 20, account: @account2, category: @category, location: @location)

    # Legacy
    # @properties[0..5].map { |property| @first_user.properties << property }

  end
end

RSpec.configure do |config|
  config.include DatasetHelpers
end