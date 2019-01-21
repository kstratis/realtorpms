class AddOwnerForeignKeyToProperties < ActiveRecord::Migration[5.2]
  def change
    add_reference :properties, :owner, foreign_key: true
  end
end
