class AddSpitogatosIdToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :spitogatos_id, :string
  end
end
