class AddTitleToProperties < ActiveRecord::Migration[5.2]
  def change
    add_column :properties, :title, :string
  end
end
