class AddSpitogatosToAccount < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :spitogatos, :boolean, default: false
  end
end
