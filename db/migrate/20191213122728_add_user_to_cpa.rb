class AddUserToCpa < ActiveRecord::Migration[5.2]
  def change
    add_reference :cpas, :user, foreign_key: true, index: true
  end
end
