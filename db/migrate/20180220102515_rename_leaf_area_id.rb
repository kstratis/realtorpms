class RenameLeafAreaId < ActiveRecord::Migration[5.1]
  def change
    rename_column :leaf_areas, :areaid, :area_id
  end
end
