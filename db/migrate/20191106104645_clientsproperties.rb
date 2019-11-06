class Clientsproperties < ActiveRecord::Migration[5.2]
  def change
    create_table :clients_properties do |t|
      t.belongs_to :client
      t.belongs_to :property
      t.boolean :ownership, default: false
    end
  end
end
