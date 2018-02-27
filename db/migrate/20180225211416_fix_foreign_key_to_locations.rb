class FixForeignKeyToLocations < ActiveRecord::Migration[5.1]
  def change
    add_column :locations, :country_id, :integer
    add_foreign_key :locations, :countries
  end
end
