class RemoveCategoryIdFromProperty < ActiveRecord::Migration[5.2]
  def change
    remove_column :properties, :category_id
  end
end
