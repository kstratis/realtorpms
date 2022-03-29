class AddLastPaidAtToAccount < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :last_paid_at, :datetime
  end
end
