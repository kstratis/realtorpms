class Anotheronewithindex < ActiveRecord::Migration[5.2]
  def change
    add_index :accounts, :owner_id
  end
end
