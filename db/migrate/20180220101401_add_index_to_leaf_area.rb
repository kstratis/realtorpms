class AddIndexToLeafArea < ActiveRecord::Migration[5.1]
  def change
    add_index :leaf_areas, :areaid, unique: true
  end
end
