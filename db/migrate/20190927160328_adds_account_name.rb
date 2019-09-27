class AddsAccountName < ActiveRecord::Migration[5.2]
  def change
    add_column :logs, :account_name, :string
  end
end
