class RenameLeafParentId < ActiveRecord::Migration[5.1]
  def change
    rename_column :leaf_areas, :parentid, :parent_id
  end
end
