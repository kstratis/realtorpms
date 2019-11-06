class ClientOffers < ActiveRecord::Migration[5.2]
  def change
    create_table :offers do |t|
      t.belongs_to :client
      t.belongs_to :property
    end
  end
end
