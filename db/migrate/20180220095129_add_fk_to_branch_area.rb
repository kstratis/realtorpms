class AddFkToBranchArea < ActiveRecord::Migration[5.1]
  def change
    add_foreign_key :branch_areas, :root_areas, column: :parentid, primary_key: :areaid
  end
end
