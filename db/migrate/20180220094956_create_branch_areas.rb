class CreateBranchAreas < ActiveRecord::Migration[5.1]
  def change
    create_table :branch_areas do |t|
      t.integer :areaid
      t.string :localname
      t.string :globalname
      t.integer :parentid

      t.timestamps
    end
  end
end
