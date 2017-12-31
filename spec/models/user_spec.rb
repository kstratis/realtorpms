require 'rails_helper'

RSpec.describe User, type: :model do
  before do
    use_regular_dataset
  end
  # Deleting a user should:
  # 1) decrement users by 1
  # 2) decrement Assignment by -5. Check dataset_helpers.rb
  # 3) decrement Membership by -1. Check dataset_helpers.rb
  it "can successfully be deleted" do
    expect(User.count).to eq(5)
    expect {
      @first_user.destroy
    }.to change { User.count }.by(-1)
     .and change { Assignment.count }.by(-5)
     .and change { Membership.count }.by(-1)
  end

end