class AddCommentsToShowings < ActiveRecord::Migration[5.2]
  def change
    add_column :cpas, :comments, :text
  end
end
