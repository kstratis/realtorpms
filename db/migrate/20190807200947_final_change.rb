class FinalChange < ActiveRecord::Migration[5.2]
  def change
    remove_column :accounts, :owner_id
    add_reference :accounts, :owner, foreign_key: { to_table: :users }, index: true
  end
end
