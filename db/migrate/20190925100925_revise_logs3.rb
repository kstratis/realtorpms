class ReviseLogs3 < ActiveRecord::Migration[5.2]
  def change
    add_column :logs, :author_name, :string
  end
end
