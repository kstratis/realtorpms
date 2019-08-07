class RemoveAccountRef2 < ActiveRecord::Migration[5.2]
  def change
    remove_reference :accounts, :owner_id, index: true, foreign_key: { to_table: :users }
  end
end
