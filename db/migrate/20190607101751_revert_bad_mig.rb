class RevertBadMig < ActiveRecord::Migration[5.2]
  def change
    add_reference :favlists, :user, index: true
    add_foreign_key :favlists, :users
  end
end
