require 'rails_helper'

RSpec::Matchers.define_negated_matcher :not_change, :change

RSpec.describe Account, type: :model do
  before do
    use_regular_dataset
  end
  it "can successfully be deleted" do
    expect(Account.count).to eq(1)
    expect(User.count).to eq(5)
    expect {
      @account.destroy
    }.to not_change { User.count }
     .and change { Property.count }.by(-50)
     .and change { Assignment.count }.by(-36) # This is because we only assign 36 properties out of 50. See dataset_helpers.rb

  end

end