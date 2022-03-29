class AddSubscriptionStatusToAccount2 < ActiveRecord::Migration[6.1]
  def change
    remove_column :accounts, :subscription_status
  end
end
