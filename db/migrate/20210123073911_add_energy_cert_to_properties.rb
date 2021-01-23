class AddEnergyCertToProperties < ActiveRecord::Migration[6.0]
  def change
    add_column :properties, :energy_cert, :integer
  end
end
