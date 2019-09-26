require 'rails_helper'

RSpec::Matchers.define_negated_matcher :not_change, :change

RSpec.describe Account, type: :model do
  before do
    use_regular_dataset
  end

  it "can successfully be deleted" do
    @account1_user_count = @account1.users.count
    # regular users
    expect(@account1.users.count).to eq(@account1_user_count)
    expect(@account1.owner.email).to eq('account.owner@example.com')
    # regular users plus owner
    expect(@account1.all_users.count).to eq(3)

    # No users are deleted on account destruction. Only membership entries are removed.
    # If the account owner is also a member of another account then we would have a problem.
    # This way we just have an orphan user.
    expect { @account1.destroy }.to change { Account.count }.by(-1)
                                        .and change { User.count }.by(0)
                                                 .and change { Membership.count }.by(-@account1_user_count) # owner are not subject to membeships join table
  end
end