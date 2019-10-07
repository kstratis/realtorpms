class AddCustomFields3 < ActiveRecord::Migration[5.2]
  def change
    add_column :properties, :preferences, :jsonb, null: false, default: '{}'
  end
end
