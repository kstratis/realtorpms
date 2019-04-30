class InvitationsEmailUnique < ActiveRecord::Migration[5.2]
  def change
    add_index :invitations, [:email, :account_id], unique: true
  end
end
