class AddPropertyTypesToProperties < ActiveRecord::Migration[5.1]
  def change
    remove_column :properties, :type
    add_column :properties, :propertytypes, :integer
  end
end
