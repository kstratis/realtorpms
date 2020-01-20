class RemovePriviledgeToUserProper < ActiveRecord::Migration[5.2]
  def change
    remove_column :users, :privileged
  end
end
