class RenameCreatedByToProperty < ActiveRecord::Migration[5.2]
  def change
    rename_column :properties, :user_id, :created_by
  end
end
