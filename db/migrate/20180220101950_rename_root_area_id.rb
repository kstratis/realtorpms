class RenameRootAreaId < ActiveRecord::Migration[5.1]
  def change
    rename_column :root_areas, :areaid, :area_id
  end
end
