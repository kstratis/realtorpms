class CreateRootAreas < ActiveRecord::Migration[5.1]
  def change
    create_table :root_areas do |t|
      t.integer :areaid
      t.string :localname
      t.string :globalname

      t.timestamps
    end
  end
end
