class AddWCsToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :wcs, :integer
  end
end
