class ChangeAgeToDob < ActiveRecord::Migration[5.2]
  def change
    remove_column :users, :age
    add_column :users, :dob, :date
  end
end
