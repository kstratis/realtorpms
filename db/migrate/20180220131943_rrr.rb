class Rrr < ActiveRecord::Migration[5.1]
  def change
    # remove_foreign_key :branch_areas, column: :root_area_id
    remove_foreign_key :branch_areas, column: :area_id
  end
end
