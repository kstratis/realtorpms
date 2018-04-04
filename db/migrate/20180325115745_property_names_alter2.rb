class PropertyNamesAlter2 < ActiveRecord::Migration[5.2]
  def change
    add_column :properties, :subcategory, :integer
  end
end
