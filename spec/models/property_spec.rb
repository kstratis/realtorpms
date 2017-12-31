require 'rails_helper'

RSpec.describe Property, type: :model do

  before do
    use_regular_dataset
  end

  it "can successfully be deleted" do
    property = @first_user.properties.first
    expect(Property.count).to eq(50)
    expect(Assignment.count).to eq(36)
    expect {
      property.destroy
    }.to change { Property.count }.by(-1)
     .and change { Assignment.count }.by(-1)
  end

end