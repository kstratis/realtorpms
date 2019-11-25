class Brokerlistagreements < ActiveRecord::Migration[5.2]
  def change
    add_column :clients, :brokerlistingagreement, :boolean, default: false
    add_column :clients, :buyerbrokeragreement, :boolean, default: false
  end
end
