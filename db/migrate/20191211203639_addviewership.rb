class Addviewership < ActiveRecord::Migration[5.2]
  def change
    add_column :cpas, :viewership, :boolean, default: false
  end
end
