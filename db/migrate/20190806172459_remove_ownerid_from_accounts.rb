class RemoveOwneridFromAccounts < ActiveRecord::Migration[5.2]
  def change
    remove_column :accounts, :owner_id
  end
end
