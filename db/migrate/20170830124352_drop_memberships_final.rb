class DropMembershipsFinal < ActiveRecord::Migration[5.1]
  def change
    drop_table :memberships
  end
end
