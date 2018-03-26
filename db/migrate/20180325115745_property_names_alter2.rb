class PropertyNamesAlter2 < ActiveRecord::Migration[5.2]
  def change
    remove_column :properties, :propertytype
    add_column :properties, :residentialsubcategory, :integer


  end
end
