class AddSpitogatosSlugToCategory < ActiveRecord::Migration[6.1]
  def change
    add_column :categories, :spitogatos_slug, :string
  end
end
