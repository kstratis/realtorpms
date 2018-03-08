class RenamePropertyCat < ActiveRecord::Migration[5.2]
  def change
    rename_column :properties, :propertycategories, :propertycategorye
  end
end
