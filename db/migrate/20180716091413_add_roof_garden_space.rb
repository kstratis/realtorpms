class AddRoofGardenSpace < ActiveRecord::Migration[5.2]
  def change
    add_column :properties, :roofgarden_space, :string
  end
end
