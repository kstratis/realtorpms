class AddKitchensToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :kitchens, :integer
  end
end
