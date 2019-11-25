class Brokerlistagreementsrename < ActiveRecord::Migration[5.2]
  def change
    rename_column :clients, :brokerlistingagreement, :ordertosell
    rename_column :clients, :buyerbrokeragreement, :ordertoview
  end
end
