class RenameRoofGarden < ActiveRecord::Migration[5.2]
  def change
    remove_column :properties, :garden
    rename_column :properties, :roofgarden_space, :roof_deck
    rename_column :properties, :storage_space, :storage
    rename_column :properties, :garden_space, :garden
  end
end
