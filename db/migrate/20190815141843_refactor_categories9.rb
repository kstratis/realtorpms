class RefactorCategories9 < ActiveRecord::Migration[5.2]
  def change
    remove_column :properties, :category
  end
end
