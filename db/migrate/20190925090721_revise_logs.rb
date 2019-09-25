class ReviseLogs < ActiveRecord::Migration[5.2]
  def change
    add_column :logs, :property_name, :string
    add_column :logs, :user_name, :string
    add_column :logs, :client_name, :string
    add_reference :logs, :account, foreign_key: true, index: true
  end
end
