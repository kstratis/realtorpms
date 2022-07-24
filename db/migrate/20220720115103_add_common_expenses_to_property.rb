class AddCommonExpensesToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :common_expenses, :integer
  end
end
