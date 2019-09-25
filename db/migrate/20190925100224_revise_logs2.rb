class ReviseLogs2 < ActiveRecord::Migration[5.2]
  def change
    add_reference :logs, :author, foreign_key: { to_table: :users }, index: true
  end
end
