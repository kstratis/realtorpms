class RenameBranchParentId2 < ActiveRecord::Migration[5.1]
  def change
    rename_column :branch_areas, :parent_id, :root_area_id
  end
end
