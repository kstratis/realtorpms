class AlterBranchAreasAreaId < ActiveRecord::Migration[5.1]
  def change
    rename_column :branch_areas, :areaid, :area_id
  end
end
