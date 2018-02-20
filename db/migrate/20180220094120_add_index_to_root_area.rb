class AddIndexToRootArea < ActiveRecord::Migration[5.1]
  def change
    add_index :root_areas, :areaid, unique: true
  end
end
