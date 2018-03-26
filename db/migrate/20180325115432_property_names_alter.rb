class PropertyNamesAlter < ActiveRecord::Migration[5.2]
  def change
    rename_column :properties, :propertycategory, :category
  end
end
