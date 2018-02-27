class AddDualColumnIndexToLocations < ActiveRecord::Migration[5.1]
  def change
    add_index :locations, [:area_id, :country_id], unique: true
  end
end
