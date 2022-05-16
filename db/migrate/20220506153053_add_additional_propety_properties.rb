class AddAdditionalPropetyProperties < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :facade_length, :integer
    add_column :properties, :distance_from_sea, :integer
    add_column :properties, :building_coefficient, :float
    add_column :properties, :coverage_ration, :integer
  end
end
