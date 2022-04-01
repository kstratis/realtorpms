class AddSubscriptionIdToAccount < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :subscription_id, :integer, default: nil
  end
end
