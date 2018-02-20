class RenameBranchParentId < ActiveRecord::Migration[5.1]
  def change
    rename_column :branch_areas, :parentid, :parent_id
  end
end
