require 'rails_helper'

module DatasetHelpers
  def use_regular_dataset
    # This creates one account and at the same time one special associated user (owner)
    @account = FactoryBot.create(:account)
    # This creates 4 regular users. In total we get 5 so far.
    users = FactoryBot.create_list(:usersequence, 4)
    # This creates 50 properties. By default all properties are owned by the 'test1' account.
    # Check out the factory to verify.
    @properties = FactoryBot.create_list(:propertysequence, 50)

    # Users don't get assigned to accounts automatically. They need to be manually assigned
    users.map { |user| @account.users << user } # This maps all -regular- users (not the owner) to our single account as simple account users

    # Assign all the properties (which already belong to 'test1' account) to the first 3 users. The owner is excluded.
    @first_user = @account.users.first
    @second_user = @account.users.second
    @third_user = @account.users.third

    # Mind that we only assign 36 of the available properties
    @properties[0..20].map { |property| @third_user.properties << property }
    @properties[21..30].map { |property| @second_user.properties << property }
    @properties[31..35].map { |property| @first_user.properties << property }

  end
end

RSpec.configure do |config|
  config.include DatasetHelpers
end