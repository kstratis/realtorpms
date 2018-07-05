class RemoveForeignLocationsKey < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :properties, :locations
  end
end
