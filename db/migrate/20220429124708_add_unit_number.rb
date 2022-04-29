class AddUnitNumber < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :unit, :string
  end
end
