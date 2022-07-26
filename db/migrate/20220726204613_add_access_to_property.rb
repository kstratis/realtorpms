class AddAccessToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :access, :integer
  end
end
