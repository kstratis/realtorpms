class AddFlavorDefaultToAccountv2 < ActiveRecord::Migration[6.1]
  def change
    add_column :accounts, :flavor, :integer
  end
end
