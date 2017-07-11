class AddSelectableFeaturesToProperties < ActiveRecord::Migration[5.1]
  def change
    add_column :properties, :type, :integer
    add_column :properties, :orientation, :integer
    add_column :properties, :view, :integer
    add_column :properties, :heating, :integer
    add_column :properties, :gas, :boolean
    add_column :properties, :solar_heating, :boolean
    add_column :properties, :furnitures, :boolean
    add_column :properties, :fit_for_students, :boolean
    add_column :properties, :fireplace, :boolean
  end
end
