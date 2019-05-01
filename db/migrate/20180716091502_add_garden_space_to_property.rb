class AddGardenSpaceToProperty < ActiveRecord::Migration[5.2]
  def change
    add_column :properties, :garden_space, :string
  end
end
