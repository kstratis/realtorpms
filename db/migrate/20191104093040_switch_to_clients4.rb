class SwitchToClients4 < ActiveRecord::Migration[5.2]
  def change
    remove_reference :clients, :property, index: true
  end
end
