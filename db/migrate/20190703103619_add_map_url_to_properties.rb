class AddMapUrlToProperties < ActiveRecord::Migration[5.2]
  def change
    add_column :properties, :map_url, :string
  end
end
