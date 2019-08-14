class RefactorCategories2 < ActiveRecord::Migration[5.2]
  def change
    create_table :categories do |t|
      t.string "localname"
      t.string "globalname"
      t.integer "level"
      t.integer "parent_id"
      t.string "parent_localname"
      t.string "parent_globalname"
    end
  end
end
