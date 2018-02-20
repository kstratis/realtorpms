class AddForeignKeyToBranchAreas < ActiveRecord::Migration[5.1]
  def change
    add_reference :branch_areas, :root_areas, index: true
    add_foreign_key :branch_areas, :root_areas, column: :area_id
  end
end
