class RemoveCreator2 < ActiveRecord::Migration[5.2]
  def change
    remove_column :properties, :creator
  end
end
