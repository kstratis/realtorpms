require 'rails_helper'

RSpec::Matchers.define_negated_matcher :not_change, :change

RSpec.describe Assignment, type: :model do
  before do
    use_regular_dataset
  end

  it "is properly working for regular users" do
    expect(User.count).to eq(6)
    expect(Property.count).to eq(30)
    expect(@account1.properties.count).to eq(10)
    expect(@account1_first_user.properties.count).to eq(0)

    # Assign to +@account1_user+ 6 properties from his main account (+account1+)
    @account1_properties[0..5].map { |property| @account1_first_user.properties << property }

    # Verify that the user can see 6 properties
    expect(@account1_first_user.properties.count).to eq(6)

    # Assign to +@account1_first_user+ 2 more properties from another account (+account2+).
    # This can happen when a user is invited in another account and is then assign a number of new properties.
    # Note that regaldless of the total number of properties assigned properties are scoped and the user should
    # only be seeing properties assigned to him/her based on the current account
    @account2_properties[0..1].map { |property| @account1_first_user.properties << property }

    # Now the total number should be 8 properties
    expect(@account1_first_user.properties.count).to eq(8)

    # Make sure that 6 are coming from the first account
    expect(@account1_first_user.properties.where(account: @account1).count).to eq(6)
    # ...and 2 from the second account
    expect(@account1_first_user.properties.where(account: @account2).count).to eq(2)

  end

  it "is properly working for owner users" do
    expect(@account1.properties.count).to eq(10)
    expect(@account1.owner.properties.count).to eq(0)
    @account2_properties[0..1].map { |property| @account1.owner.properties << property }
    expect(@account1.owner.properties.count).to eq(2)
  end


end