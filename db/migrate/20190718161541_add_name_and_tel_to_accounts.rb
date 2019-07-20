class AddNameAndTelToAccounts < ActiveRecord::Migration[5.2]
  def change
    add_column :accounts, :name, :string
    add_column :accounts, :telephones, :string
  end
end
