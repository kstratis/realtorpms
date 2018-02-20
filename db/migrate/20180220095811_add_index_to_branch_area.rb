class AddIndexToBranchArea < ActiveRecord::Migration[5.1]
  def change
    add_index :branch_areas, :areaid, unique: true
  end
end
