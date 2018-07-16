class FinalRenameGarden < ActiveRecord::Migration[5.2]
  def change
    rename_column :properties, :roof_deck, :roofdeck_space
    rename_column :properties, :storage, :storage_space
    rename_column :properties, :garden, :garden_space
  end
end
