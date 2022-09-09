class AddSpitogatosTimeStampsToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :spitogatos_created_at, :datetime, null: true
    add_column :properties, :spitogatos_updated_at, :datetime, null: true
  end
end
