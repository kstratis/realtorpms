class RefactorCategories8 < ActiveRecord::Migration[5.2]
  def change
    add_column :categories, :parent_slug, :string
  end
end
