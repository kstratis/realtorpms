require 'rails_helper'

RSpec.describe Property, type: :model do

  before do
    use_regular_dataset
  end
  # Deleting a property should:
  # 1) Decrement properties count by 1
  # 2) Decrement each user's property count by 1
  # 3) Decrement the Assignments count by the number of established assignments
  # Check dataset_helpers.rb
  it "can successfully be deleted" do
    expect(Property.count).to eq(30)
    expect(Assignment.count).to eq(0)
    expect(@account1_first_user.properties.count).to eq(0)

    @account1_first_user.properties << @account1_properties.first
    expect(@account1_first_user.properties.count).to eq(1)
    @account2_first_user.properties << @account1_properties.first
    expect(@account2_first_user.properties.count).to eq(1)

    expect {
      @account1_properties.first.destroy
    }.to change { Property.count }.by(-1)
             .and change { @account1_first_user.properties.count }.by(-1)
                      .and change { @account2_first_user.properties.count }.by(-1)
                               .and change { Assignment.count }.by(-2)

  end

end