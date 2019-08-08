class AddLandlordToAccounts < ActiveRecord::Migration[5.2]
  def change
    add_reference :accounts, :landlord, index: true
  end
end
