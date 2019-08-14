class RefactorCategories7 < ActiveRecord::Migration[5.2]
  def change
    add_column :categories, :slug, :string
  end
end
