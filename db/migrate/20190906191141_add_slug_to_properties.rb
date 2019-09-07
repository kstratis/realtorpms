class AddSlugToProperties < ActiveRecord::Migration[5.2]
  def change
    add_column :properties, :slug, :string, after: :id
  end
end
