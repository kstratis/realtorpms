require 'rails_helper'

module DatasetHelpers
  def use_regular_dataset
    @account = FactoryGirl.create(:account) # This creates one account and at the same time one associated user (owner)
    users = FactoryGirl.create_list(:usersequence, 4) # This creates 4 users
    @properties = FactoryGirl.create_list(:propertysequence, 50) # This created 50 properties

    users.map { |user| @account.users << user } # This maps all -regular- users (not the owner) to our single account as simple account users

    # puts "helper reports user count as: #{users.count}"

    # Assign all the properties to the first 3 users. The owner is excluded.
    @first_user = @account.users.first
    @second_user = @account.users.second
    @third_user = @account.users.third

    @properties[0..20].map { |property| @third_user.properties << property }
    @properties[21..30].map { |property| @second_user.properties << property }
    @properties[31..35].map { |property| @first_user.properties << property }

    # puts "first user has been assigned #{@first_user.properties.count} properties"
  end
end

RSpec.configure do |config|
  config.include DatasetHelpers
end