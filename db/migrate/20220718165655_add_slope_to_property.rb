class AddSlopeToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :slope, :integer
  end
end
