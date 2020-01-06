class ScopeCpAs < ActiveRecord::Migration[5.2]
  def change
    add_reference :cpas, :account, foreign_key: true, index: true
  end
end
