class AddActiveToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :active, :boolean, default: false
  end
end
