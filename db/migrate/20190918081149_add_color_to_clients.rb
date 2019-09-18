class AddColorToClients < ActiveRecord::Migration[5.2]
  def change
    add_column :clients, :color, :text
  end
end
