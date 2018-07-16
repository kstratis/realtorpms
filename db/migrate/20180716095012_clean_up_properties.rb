class CleanUpProperties < ActiveRecord::Migration[5.2]
  def change
    remove_column :properties, :without_property_charges
    remove_column :properties, :fit_for_professional_use
    remove_column :properties, :parking
    remove_column :properties, :balconies
    remove_column :properties, :storage_room
    remove_column :properties, :orientation
    remove_column :properties, :view
    remove_column :properties, :heating
    remove_column :properties, :gas
    remove_column :properties, :solar_heating
    remove_column :properties, :furnitures
    remove_column :properties, :fit_for_students
    remove_column :properties, :fireplace
    remove_column :properties, :awnings
    remove_column :properties, :without_elevator
    remove_column :properties, :clima
    remove_column :properties, :security_door
    remove_column :properties, :pool
  end
end
