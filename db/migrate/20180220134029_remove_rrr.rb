class RemoveRrr < ActiveRecord::Migration[5.1]
  def change
    remove_foreign_key :branch_areas, column: :root_areas_id
    # remove_foreign_key :branch_areas, column: :root_area_id
  end
end
