class AddHeatingTypeToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :heatingtype, :integer
  end
end
