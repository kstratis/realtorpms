class AddPowerToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :power, :integer
  end
end
