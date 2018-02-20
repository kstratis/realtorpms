class AddForeignKeyToBranchAreas2 < ActiveRecord::Migration[5.1]
  def change
    add_foreign_key :branch_areas, :root_areas, column: :root_areas_id, primary_key: :area_id
  end
end
