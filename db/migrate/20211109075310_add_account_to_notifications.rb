class AddAccountToNotifications < ActiveRecord::Migration[6.1]
  def change
    add_reference :notifications, :account, foreign_key: true, index: true
  end
end
