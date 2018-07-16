class AddStorageSpaceToProperty < ActiveRecord::Migration[5.2]
  def change
    add_column :properties, :storage_space, :string
  end
end
