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
             .and change { Account.count }.by(-1)
                      .and change { Property.count }.by(-50)
                               .and change { Assignment.count }.by(-36) # This is because we only assign 36 properties out of 50. See dataset_helpers.rb
  end

  it "can successfully be deleted - enhanced" do
    @account1_user_count = @account1.users.count
    # regular users
    expect(@account1.users.count).to eq(@account1_user_count)
    expect(@account1.owner.email).to eq('account.owner@example.com')
    # regular users plus owner
    expect(@account1.all_users.count).to eq(3)

    expect { @account1.destroy }.to change { Account.count }.by(-1)
                                        .and change { User.count }.by(-1) # n users plus the account owner are deleted
                                                 .and change { Membership.count }.by(-@account1_user_count) # owner are not subject to membeships join table
  end
end