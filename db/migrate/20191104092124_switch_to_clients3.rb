class SwitchToClients3 < ActiveRecord::Migration[5.2]
  def change
    add_reference :clients, :property, foreign_key: true, index: true
  end
end
