class AddNotesToProperties < ActiveRecord::Migration[5.2]
  def change
    add_column :properties, :notes, :string
  end
end
