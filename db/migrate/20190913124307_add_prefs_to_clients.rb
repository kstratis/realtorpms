class AddPrefsToClients < ActiveRecord::Migration[5.2]
  def change
    add_column :clients, :searchprefs, :text
  end
end
