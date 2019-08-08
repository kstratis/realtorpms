class RefactorActiveUser < ActiveRecord::Migration[5.2]
  def change
    remove_column :users, :active
    add_column :memberships, :active, :boolean, :default => 1
  end
end
