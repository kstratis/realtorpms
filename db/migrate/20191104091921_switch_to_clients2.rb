class SwitchToClients2 < ActiveRecord::Migration[5.2]
  def change
    remove_reference :landlords, :account, index: true
    remove_reference :properties, :landlord, index: true
  end
end
