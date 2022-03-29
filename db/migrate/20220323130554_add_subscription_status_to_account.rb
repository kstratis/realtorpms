class AddSubscriptionStatusToAccount < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :subscription_status, :integer
  end
end
