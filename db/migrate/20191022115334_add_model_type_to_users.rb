class AddModelTypeToUsers < ActiveRecord::Migration[5.2]
  def change
    add_reference :users, :model_type, foreign_key: true, index: true
  end
end
