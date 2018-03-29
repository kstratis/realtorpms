class RemovePropertyType < ActiveRecord::Migration[5.2]
  def change
    remove_column :properties, :propertytype
  end
end
