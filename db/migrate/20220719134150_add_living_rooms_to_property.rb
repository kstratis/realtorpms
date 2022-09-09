class AddLivingRoomsToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :living_rooms, :integer
  end
end
