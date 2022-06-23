class AddMarkerTypeToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :marker, :integer
  end
end
