class AddBranchAreas2 < ActiveRecord::Migration[5.1]
  def change
    create_table :branch_areas do |t|
      t.integer :areaid
      t.string :localname
      t.string :globalname
      t.integer :root_area_id
      t.timestamps
    end
    add_foreign_key :branch_areas, :root_areas, primary_key: :area_id

  end
end


