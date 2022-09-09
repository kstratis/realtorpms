class AddZoningToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :zoning, :integer
  end
end
