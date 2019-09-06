class RemoveCreator < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :properties, :users
  end
end
