class AddAccountIdToProperties < ActiveRecord::Migration[5.1]
  def change
    add_reference :properties, :account, foreign_key: true
  end
end
