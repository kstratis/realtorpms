class AddModelTypeToClients < ActiveRecord::Migration[5.2]
  def change
    add_column :clients, :model_type_id, :integer
  end
end
