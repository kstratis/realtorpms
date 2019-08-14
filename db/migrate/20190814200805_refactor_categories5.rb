class RefactorCategories5 < ActiveRecord::Migration[5.2]
  def change
    add_reference :properties, :category, foreign_key: true, index: true
  end
end
