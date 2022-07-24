class AddFloortypeToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :floortype, :integer
  end
end
