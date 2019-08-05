class AlterLocations < ActiveRecord::Migration[5.2]
  def change
    remove_column :locations, :area_id
  end
end
