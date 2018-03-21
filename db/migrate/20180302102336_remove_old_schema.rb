class RemoveOldSchema < ActiveRecord::Migration[5.1]
  def change
    drop_table :leaf_areas
    drop_table :branch_areas
    drop_table :root_areas
  end
end
