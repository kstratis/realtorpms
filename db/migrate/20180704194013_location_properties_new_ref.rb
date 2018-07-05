class LocationPropertiesNewRef < ActiveRecord::Migration[5.2]
  def change
    add_reference :properties, :location, foreign_key: true
  end
end
