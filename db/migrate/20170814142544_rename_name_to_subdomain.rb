class RenameNameToSubdomain < ActiveRecord::Migration[5.1]
  def change
    rename_column :accounts, :name, :subdomain
    add_index :accounts, :subdomain
  end
end
