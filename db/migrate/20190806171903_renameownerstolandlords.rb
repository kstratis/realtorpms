class Renameownerstolandlords < ActiveRecord::Migration[5.2]
  def change
    rename_table :owners, :landlords
  end
end
