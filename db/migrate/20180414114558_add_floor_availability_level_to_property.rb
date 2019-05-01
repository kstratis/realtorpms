class AddFloorAvailabilityLevelToProperty < ActiveRecord::Migration[5.2]
  def change
    add_column :properties, :floor, :integer
    add_column :properties, :levels, :integer
    add_column :properties, :availability, :datetime
  end
end
