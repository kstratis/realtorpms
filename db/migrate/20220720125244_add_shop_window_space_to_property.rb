class AddShopWindowSpaceToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :shopwindow_space, :string
  end
end
