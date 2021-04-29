class AddHasEnabledWebsiteToAccounts < ActiveRecord::Migration[6.0]
  def change
    add_column :accounts, :website_enabled, :boolean
  end
end
