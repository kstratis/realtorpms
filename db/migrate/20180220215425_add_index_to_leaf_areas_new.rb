class AddIndexToLeafAreasNew < ActiveRecord::Migration[5.1]
  def change
    add_index :leaf_areas, :area_id, unique: true
  end
end
