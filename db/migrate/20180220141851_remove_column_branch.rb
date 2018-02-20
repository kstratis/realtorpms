class RemoveColumnBranch < ActiveRecord::Migration[5.1]
  def change
    drop_table :branch_areas
  end
end
