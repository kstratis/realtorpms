class RenameCreatedByToProperty2 < ActiveRecord::Migration[5.2]
  def change
    rename_column :properties, :created_by, :creator
  end
end
