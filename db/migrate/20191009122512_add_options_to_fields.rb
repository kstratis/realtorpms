class AddOptionsToFields < ActiveRecord::Migration[5.2]
  def change
    add_column :entity_fields, :options, :string
  end
end
