class AddPropertyOwnerToProperties < ActiveRecord::Migration[5.2]
  def change
    add_column :properties, :property_owner, :string
  end
end