class RenamePropertyTypesToPropertyType < ActiveRecord::Migration[5.1]
  def change
    rename_column :properties, :propertytypes, :propertytype
  end
end
