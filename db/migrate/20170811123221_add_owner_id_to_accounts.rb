class AddOwnerIdToAccounts < ActiveRecord::Migration[5.1]
  def change
    add_column :accounts, :owner_id, :integer
  end
end
