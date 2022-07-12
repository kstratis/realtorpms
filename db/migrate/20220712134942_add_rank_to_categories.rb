class AddRankToCategories < ActiveRecord::Migration[6.1]
  def change
    add_column :categories, :rank, :integer
  end
end
