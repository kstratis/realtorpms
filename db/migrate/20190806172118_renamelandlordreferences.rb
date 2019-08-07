class Renamelandlordreferences < ActiveRecord::Migration[5.2]
  def change
    rename_column :properties, :owner_id, :landlord_id
  end
end
