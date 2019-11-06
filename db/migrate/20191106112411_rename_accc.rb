class RenameAccc < ActiveRecord::Migration[5.2]
  def change
    rename_table :clients_properties, :cpas
  end
end
