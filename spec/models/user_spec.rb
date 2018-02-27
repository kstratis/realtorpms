require 'rails_helper'

RSpec::Matchers.define_negated_matcher :not_change, :change

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
    expect(Property.count).to eq(50)
    expect {
      @first_user.destroy
    }.to change { User.count }.by(-1)  # expect User count to be decremented by -1
     .and change { Assignment.count }.by(-5) # Properties assigned to this user are deleted through the assignment table. (the actual properties still exist though)
     .and change { Membership.count }.by(-1) # The user's membership to 'test1' account is deleted through the membership table
     .and not_change { Property.count } # The actual properties should remain intact cause they may be already assigned to another user
  end

end