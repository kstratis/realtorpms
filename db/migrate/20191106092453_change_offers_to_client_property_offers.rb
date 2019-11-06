class ChangeOffersToClientPropertyOffers < ActiveRecord::Migration[5.2]
  def change
    rename_table :offers, :client_property_offers
  end
end
