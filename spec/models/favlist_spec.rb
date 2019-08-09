require 'rails_helper'

RSpec::Matchers.define_negated_matcher :not_change, :change

RSpec.describe Favlist, type: :model do
  before do
    use_regular_dataset
    @account1_first_user.favlists.create(name: 'list1', account: @account1)
    @account1_first_user.favlists.create(name: 'list2', account: @account1)
    @account1_first_user.favlists.create(name: 'list3', account: @account2)
    @account2_first_user.favlists.create(name: 'list4', account: @account1)
  end

  it "can successfully be deleted standalone" do
    expect(@account1_first_user.favlists.count).to eq(3)
    expect(@account1_first_user.favlists.where(account: @account1).count).to eq(2) # Make sure the count is different between accounts
    expect(@account1_first_user.favlists.where(account: @account2).count).to eq(1)
    expect { @account1_first_user.favlists.first.destroy }.to change { @account1_first_user.favlists.count }.by(-1)
  end

  it "can successfully be deleted by deleting its user" do
    expect(@account1_first_user.favlists.count).to eq(3)
    expect(@account2_first_user.favlists.count).to eq(1)
    expect(@account1_first_user.favlists.where(account: @account1).count).to eq(2) # Make sure the count is different between accounts
    expect(@account1_first_user.favlists.where(account: @account2).count).to eq(1)

    expect { @account1_first_user.destroy }.to change { Favlist.where(user: @account1_first_user).count }.by(-3)
    expect { @account2_first_user }.to not_change { Favlist.where(user: @account2_first_user).count }

    expect(@account2_first_user.favlists.where(account: @account2).count).to eq(0)
    expect(@account2_first_user.favlists.where(account: @account1).count).to eq(1)

  end

  it "can successfully be deleted by deleting its account" do
    expect(@account1_first_user.favlists.count).to eq(3)
    expect(@account2_first_user.favlists.count).to eq(1)
    expect(@account1_first_user.favlists.where(account: @account1).count).to eq(2) # Make sure the count is different between accounts
    expect(@account1_first_user.favlists.where(account: @account2).count).to eq(1)

    expect { @account1.destroy }.to change { Favlist.where(account: @account1).count }.by(-3)
                                        .and not_change { @account2.favlists.count }
                                                 .and change { @account1.favlists.count }.by(-3)
                                                      .and change{ @account1_first_user.favlists.count }.by(-2) # +@account1_first_user+ has only 2 favlists in +@account1+
                                                               .and change {@account2_first_user.favlists.count}.by(-1)
  end
end