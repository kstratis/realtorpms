class RemoveAccountRef < ActiveRecord::Migration[5.2]
  def change
    remove_reference :accounts, :user, index: true, foreign_key: true
  end
end
