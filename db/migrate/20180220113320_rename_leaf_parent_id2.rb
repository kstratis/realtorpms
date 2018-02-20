class RenameLeafParentId2 < ActiveRecord::Migration[5.1]
  def change
    rename_column :leaf_areas, :parent_id, :branch_area_id
  end
end
