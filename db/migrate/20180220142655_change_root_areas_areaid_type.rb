class ChangeRootAreasAreaidType < ActiveRecord::Migration[5.1]
  def change
    change_column :root_areas, :area_id, :bigint
  end
end
