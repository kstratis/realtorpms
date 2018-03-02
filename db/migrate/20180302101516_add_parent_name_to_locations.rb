class AddParentNameToLocations < ActiveRecord::Migration[5.1]
  def change
    add_column :locations, :parent_localname, :string
    add_column :locations, :parent_globalname, :string
  end
end
