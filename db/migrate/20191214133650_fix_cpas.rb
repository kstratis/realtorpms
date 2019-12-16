class FixCpas < ActiveRecord::Migration[5.2]
  def change
    remove_column :cpas, :client_id
    remove_column :cpas, :property_id
    add_reference :cpas, :client, foreign_key: true, index: true
    add_reference :cpas, :property, foreign_key: true, index: true
  end
end
