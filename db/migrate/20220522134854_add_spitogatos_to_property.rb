class AddSpitogatosToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :spitogatos_sync, :boolean, default: false
  end
end
