class AlterMembershipUnique < ActiveRecord::Migration[5.2]
  def change
    add_index :memberships, [:account_id, :user_id], unique: true
  end
end
