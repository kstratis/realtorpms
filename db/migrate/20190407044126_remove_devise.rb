class RemoveDevise < ActiveRecord::Migration[5.2]
  def change
    remove_column :users, :encrypted_password
    remove_column :users, :reset_password_token
    remove_column :users, :reset_password_sent_at
    remove_column :users, :remember_created_at
    remove_column :users, :confirmation_token
    remove_column :users, :confirmed_at
    remove_column :users, :confirmation_sent_at
    remove_column :users, :unconfirmed_email
    # remove_index :users, name: "index_users_on_reset_password_token"
    add_column :users, :password_digest, :string
    change_column_default :users, :email, 0
  end
end
