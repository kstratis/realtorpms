class AddSubscriptionStatusToAccount3 < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :subscription_status, :integer, default: 0
  end
end
