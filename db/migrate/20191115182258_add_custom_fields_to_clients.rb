class AddCustomFieldsToClients < ActiveRecord::Migration[5.2]
  def change
    add_column :clients, :preferences, :jsonb, null: false, default: {}
  end
end
