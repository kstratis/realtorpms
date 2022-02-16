class AddFlavorDefaultToAccount < ActiveRecord::Migration[6.1]
  def change
    remove_column :accounts, :flavor
  end
end
