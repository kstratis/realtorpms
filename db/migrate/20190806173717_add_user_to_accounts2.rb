class AddUserToAccounts2 < ActiveRecord::Migration[5.2]
  def change
    add_reference :accounts, :owner_id, foreign_key: { to_table: :users }, index: true
  end
end
