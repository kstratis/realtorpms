class AddPriviledgeToUserTrueProper < ActiveRecord::Migration[5.2]
  def change
    add_column :memberships, :privileged, :boolean, default: false
  end
end
