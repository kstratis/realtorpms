class RemoveAnIndex < ActiveRecord::Migration[5.2]
  def change
    remove_index "accounts", name: "index_accounts_on_owner_id"
  end
end
