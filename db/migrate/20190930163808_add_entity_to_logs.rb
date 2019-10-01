class AddEntityToLogs < ActiveRecord::Migration[5.2]
  def change
    add_column :logs, :entity, :string
  end
end
