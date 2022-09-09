class DropHasEnergyCertFromProperties < ActiveRecord::Migration[6.1]
  def change
    remove_column :properties, :has_energy_cert
  end
end
