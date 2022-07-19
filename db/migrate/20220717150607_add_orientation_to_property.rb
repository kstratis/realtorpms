class AddOrientationToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :orientation, :integer
  end
end
