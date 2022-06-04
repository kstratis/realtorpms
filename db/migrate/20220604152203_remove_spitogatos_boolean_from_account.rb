class RemoveSpitogatosBooleanFromAccount < ActiveRecord::Migration[6.1]
  def change
    remove_column :accounts, :spitogatos
  end
end
