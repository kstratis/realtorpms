class AddStatusToSpitogatosConf < ActiveRecord::Migration[6.1]
  def change
    add_column :spitogatos, :valid, :boolean, default: false
  end
end
