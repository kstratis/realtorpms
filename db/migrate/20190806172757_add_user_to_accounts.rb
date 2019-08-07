class AddUserToAccounts < ActiveRecord::Migration[5.2]
  def change
    add_reference :accounts, :user, foreign_key: true, index: true
  end
end
