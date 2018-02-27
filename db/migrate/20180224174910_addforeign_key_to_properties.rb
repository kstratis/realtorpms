class AddforeignKeyToProperties < ActiveRecord::Migration[5.1]
  def change
    add_column :properties, :location_id, :integer
    add_foreign_key :properties, :locations
  end
end
