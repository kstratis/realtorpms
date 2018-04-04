class AddCategories < ActiveRecord::Migration[5.2]
  def change
    create_table :categories do |t|
      t.string :localname
      t.string :globalname
      t.string :parent_localname
      t.string :parent_globalname
      t.timestamps
    end
  end
end
