class AddFlavorToAccount < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :flavor, :boolean
  end
end
