class AddCategoryFkToProperty < ActiveRecord::Migration[5.2]
  def change
    # add_column :properties, :category_id, :integer
    remove_foreign_key :properties, :categories
  end
end
