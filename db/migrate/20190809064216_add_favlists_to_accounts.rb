class AddFavlistsToAccounts < ActiveRecord::Migration[5.2]
  def change
    add_reference :favlists, :account, foreign_key: true, index: true
  end
end
