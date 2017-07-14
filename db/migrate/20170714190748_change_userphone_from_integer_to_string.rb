class ChangeUserphoneFromIntegerToString < ActiveRecord::Migration[5.1]
  def change
    change_column :users, :phone1, :string
    change_column :users, :phone2, :string
  end
end
