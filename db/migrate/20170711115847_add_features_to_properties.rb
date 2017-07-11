class AddFeaturesToProperties < ActiveRecord::Migration[5.1]
  def change
    add_column :properties, :price, :integer
    add_column :properties, :size, :integer
    add_column :properties, :construction, :integer
    add_column :properties, :renovation, :integer
    add_column :properties, :bedrooms, :integer
    add_column :properties, :bathrooms, :integer
    add_column :properties, :awnings, :boolean
    add_column :properties, :without_elevator, :boolean
    add_column :properties, :clima, :boolean
    add_column :properties, :security_door, :boolean
    add_column :properties, :pool, :boolean
    add_column :properties, :without_property_charges, :boolean
    add_column :properties, :fit_for_professional_use, :boolean
    add_column :properties, :parking, :boolean
    add_column :properties, :balconies, :boolean
    add_column :properties, :storage_room, :boolean
    add_column :properties, :garden, :boolean
  end
end
