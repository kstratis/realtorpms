class RemoveForeignLocationsKey2 < ActiveRecord::Migration[5.2]
  def change
    remove_column :properties, :location_id
  end
end
