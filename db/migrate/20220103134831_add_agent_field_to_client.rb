class AddAgentFieldToClient < ActiveRecord::Migration[6.1]
  def change
    add_column :clients, :agent, :boolean, default: false
  end
end
