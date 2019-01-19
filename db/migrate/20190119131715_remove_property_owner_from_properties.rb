class RemovePropertyOwnerFromProperties < ActiveRecord::Migration[5.2]
  def change
    remove_column :properties, :property_owner
  end
end
