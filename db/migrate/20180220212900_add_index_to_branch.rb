class AddIndexToBranch < ActiveRecord::Migration[5.1]
  def change
    add_index :branch_areas, :area_id, unique: true
  end
end
