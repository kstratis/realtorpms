class AddHasEnergyCertToProperties < ActiveRecord::Migration[6.0]
  def change
    add_column :properties, :has_energy_cert, :boolean
  end
end
