class AddStatusToSpitogatosConf2 < ActiveRecord::Migration[6.1]
  def change
    rename_column :spitogatos, :valid, :active
  end
end
