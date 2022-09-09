class AddBalconySpaceToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :balcony_space, :string
  end
end
