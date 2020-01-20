class AddPriviledgeToUserProper < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :privileged, :boolean, default: false
  end
end
