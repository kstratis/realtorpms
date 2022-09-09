class AddJoineryToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :joinery, :integer
  end
end
