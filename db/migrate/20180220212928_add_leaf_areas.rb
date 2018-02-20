class AddLeafAreas < ActiveRecord::Migration[5.1]
  def change
    create_table :leaf_areas do |t|
      t.integer :area_id
      t.string :localname
      t.string :globalname
      t.integer :branch_area_id
      t.timestamps
    end
    add_foreign_key :leaf_areas, :branch_areas, primary_key: :area_id
  end
end