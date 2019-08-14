class RefactorCategories4 < ActiveRecord::Migration[5.2]
  def change
    remove_reference :categories, :property, index: true
  end
end
