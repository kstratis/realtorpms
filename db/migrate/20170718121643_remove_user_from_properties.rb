class RemoveUserFromProperties < ActiveRecord::Migration[5.1]
  def change
    remove_column :properties, :user_id
  end
end
