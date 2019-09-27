require 'rails_helper'

RSpec::Matchers.define_negated_matcher :not_change, :change

RSpec.describe User, type: :model do
  before do
    use_regular_dataset
  end
  # Deleting a user should:
  # 1) Decrement users by 1
  # 2) Decrement Assignments by the number of assigned properties. Check dataset_helpers.rb
  # 3) Decrement Membership by the number of accounts this user belongs to. Check dataset_helpers.rb
  it "can successfully be deleted" do
    # 6 initial users
    expect(User.count).to eq(6)
    # 30 initial properties
    expect(Property.count).to eq(30)
    # assing the first 6 properties to +@account1_first_user+
    @account1_properties[0..5].map { |property| @account1_first_user.properties << property }
    expect {
      # delete the user
      @account1_first_user.destroy
    }.to change { User.count }.by(-1) # expect User count to be decremented by -1
             .and change { Assignment.count }.by(-6) # Properties assigned to this user are deleted through the assignment table. (the actual properties still exist though)
                      .and change { Membership.count }.by(-1) # The user's membership to 'test1' account is deleted through the membership table. -1 if the user belongs to one account
                               .and not_change { Property.count } # The actual properties should remain intact cause they may be already assigned to another user
  end

  it "can successfully be added to another account" do
    # 2 regular users for +account2+
    expect(@account2.users.count).to eq(2)
    # 2 regular users for +account2+ plus the owner
    expect(@account2.all_users.count).to eq(3)
    expect {
      # add a user from +account1+ to +account2+
      @account2.users << @account1_first_user
    }.to change { @account2.users.count }.by(1)
             .and change { @account2.all_users.count }.by(1)
                      .and change { Membership.count }.by(1)
  end

  it "can successfully be deleted when is a regular user and belongs to a single account" do
    # regular users
    expect(@account1.users.count).to eq(2)
    # regular users plus owner
    expect(@account1.all_users.count).to eq(3)

    expect { @account1.users.first.destroy }.to not_change { Account.count }
                                                    .and change { @account1.users.count }.by(-1)
                                                             .and not_change { @account2.users.count }
                                                                      .and change { Membership.count }.by(-1)
  end

  it "can successfully be deleted when belonging to multiple accounts" do
    # 2 regular users for +account2+
    expect(@account2.users.count).to eq(2)
    # 2 regular users for +account2+ plus the owner
    expect(@account2.all_users.count).to eq(3)
    expect {
      # add a user from +account1+ to +account2+
      @account2.users << @account1_first_user
    }.to change { @account2.users.count }.by(1) # expect account2 users count to go up by 1
             .and change { @account2.all_users.count }.by(1) # expect account2 total users count to go up by 1
                      .and change { Membership.count }.by(1) # expect Membership count to go up by 1
    @user2_accounts_count = @account1_first_user.accounts.count
    expect { @account1_first_user.destroy }.to change { @account2.users.count }.by(-1) # Deleting that user should affect the account count of both accounts
                                                   .and change { @account1.users.count }.by(-1)
                                                            .and change { Membership.count }.by(-@user2_accounts_count) # and the membeship count by -2
  end

  it "can successfully be added to another account when is already an account owner" do
    # regular users
    expect(@account1.users.count).to eq(2)
    # regular users plus owner
    expect(@account1.all_users.count).to eq(3)
    # regular users
    expect(@account2.users.count).to eq(2)
    # regular users plus owner
    expect(@account2.all_users.count).to eq(3)
    expect { @account2.users << @account1.owner }.to change { @account2.users.count }.by(1)
                                                         .and change { @account2.all_users.count }.by(1)
                                                                  .and not_change { @account1.users.count }
                                                                           .and not_change { @account1.all_users.count }
                                                                                    .and change { Membership.count }.by(1)
  end

  # We are not testing favlists or favorites
  it "can successfully be deleted when is an account owner" do
    @account1_user_count = @account1.users.count
    # regular users
    expect(@account1.users.count).to eq(@account1_user_count)
    expect(@account1.owner.email).to eq('account.owner@example.com')
    # regular users plus owner
    expect(@account1.all_users.count).to eq(3)

    expect { @account1.owner.destroy }.to change { Account.count }.by(-1)
                                              .and change { User.count }.by(-1)
                                                       .and change { Membership.count }.by(-@account1_user_count) # owner are not subject to membeships join table
  end


  # This is an attempt to mimic the +destroy+ action of the users controller (multi account user)
  it "can successfully be deleted when is a regular user and belongs to more than one account" do
    # The first regular user of account 2 starts off belonging to 1 account
    expect(@account2_first_user.get_account_count).to eq(1)

    # He's got no properties assigned but we give me a couple and confirm.
    expect(@account2_first_user.properties.count).to eq(0)
    @account2_first_user.properties << @account2_properties.first
    @account2_first_user.properties << @account2_properties.second
    expect(@account2_first_user.properties.count).to eq(2)

    # We then add him to Account 1
    @account1.users << @account2_first_user
    # and assign him 3 properties from account 1
    @account2_first_user.properties << @account1_properties.first
    @account2_first_user.properties << @account1_properties.second
    @account2_first_user.properties << @account1_properties.third

    # verify that @account2_first_user now totally has 5 properties. 2 from his original account and 3 from the new one
    expect(@account2_first_user.properties.count).to eq(5)

    # Delete the user from the new account. Mimic the controller action +destroy+
    expect do
      Membership.find_by(account: @account1, user: @account2_first_user).destroy # This one is unique
      Assignment.where(user: @account2_first_user).joins(:property).where(properties: {account: @account1}).try(:destroy_all)
      Clientship.where(user: @account2_first_user).joins(:client).where(clients: {account: @account1}).try(:destroy_all)
      Favlist.where(account: @account1, user: @account2_first_user).try(:destroy_all)
    end.to change { Membership.count }.by(-1)
               .and change { Assignment.count }.by(-3)
                        .and not_change { User.count }
                                 .and not_change { Account.count }
                                          .and not_change { Clientship.count }
                                                   .and not_change { Favlist.count }

  end

  # This is an attempt to mimic the +destroy+ action of the users controller (single account user)
  it "can successfully be deleted when is a regular user and belongs to a single account" do
    # The first regular user of account 2 starts off belonging to 1 account
    expect(@account2_first_user.get_account_count).to eq(1)

    # He's got no properties assigned but we give me a couple and confirm.
    expect(@account2_first_user.properties.count).to eq(0)
    @account2_first_user.properties << @account2_properties.first
    @account2_first_user.properties << @account2_properties.second
    expect(@account2_first_user.properties.count).to eq(2)
    expect(@account2.users.count).to eq(2)

    # Delete the user from the new account. Mimic the controller action +destroy+
    expect { @account2_first_user.destroy }.to change { Assignment.count }.by(-2)
                                                   .and change { Membership.count }.by(-1)
                                                            .and change { User.count }.by(-1)
                                                                     .and not_change { Account.count }
                                                                              .and not_change { Clientship.count }
                                                                                       .and not_change { Favlist.count }
                                                                                                .and not_change { Property.count }

  end

end