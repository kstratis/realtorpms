class AlterCategories < ActiveRecord::Migration[5.2]
  def change
    remove_column :categories, :globalname
    remove_column :categories, :parent_globalname
    rename_column :categories, :localname, :name
    rename_column :categories, :parent_localname, :parent_name
  end
end
