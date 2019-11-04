class SwitchToClients < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :properties, :landlords
  end
end
