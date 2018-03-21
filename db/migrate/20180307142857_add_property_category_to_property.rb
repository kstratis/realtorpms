class AddPropertyCategoryToProperty < ActiveRecord::Migration[5.2]
  def change
    add_column :properties, :propertycategory, :integer
  end
end
