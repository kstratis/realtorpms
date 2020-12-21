class AddEmailConfirmColumnToAccounts < ActiveRecord::Migration[6.0]
  def change
    add_column :accounts, :email_confirmed, :boolean, default: false
    add_column :accounts, :confirm_token, :string
  end
end
