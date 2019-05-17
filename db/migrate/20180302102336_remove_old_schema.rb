class RemoveOldSchema < ActiveRecord::Migration[5.1]
  def change
    table_exists?(:leaf_areas) ? drop_table(:leaf_areas) : nil
    table_exists?(:branch_areas) ? drop_table(:branch_areas) : nil
    table_exists?(:root_areas) ? drop_table(:root_areas) : nil
  end
end
