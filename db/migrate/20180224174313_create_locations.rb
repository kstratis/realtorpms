class CreateLocations < ActiveRecord::Migration[5.1]
  def change
    create_table :locations do |t|
      t.integer :area_id
      t.string :localname
      t.string :globalname
      t.integer :level
      t.integer :parent_id

      t.timestamps
    end
  end
end
