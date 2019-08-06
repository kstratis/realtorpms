require 'rails_helper'

RSpec.describe Property, type: :model do

  before do
    use_regular_dataset
  end
  # Deleting a property should:
  # 1) decrement properties by 1
  # 2) decrement Assignments by -1. Check dataset_helpers.rb
  it "can successfully be deleted" do
    property = @account1_first_user.properties.first
    expect(Property.count).to eq(30)
    expect(Assignment.count).to eq(36)
    expect {
      property.destroy
    }.to change { Property.count }.by(-1)
     .and change { Assignment.count }.by(-1)
  end

end