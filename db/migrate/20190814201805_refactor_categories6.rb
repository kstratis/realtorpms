class RefactorCategories6 < ActiveRecord::Migration[5.2]
  def change
    remove_column :properties, :subcategory
  end
end
