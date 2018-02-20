class AddFkToLeafArea < ActiveRecord::Migration[5.1]
  def change
    add_foreign_key :leaf_areas, :branch_areas, column: :parentid, primary_key: :areaid
  end
end
