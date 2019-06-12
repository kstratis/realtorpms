class UniqueFavs < ActiveRecord::Migration[5.2]
  def change
    add_index :favlists_properties, [:favlist_id, :property_id], unique: true
    add_index :favlists_properties, [:property_id, :favlist_id], unique: true
  end
end
