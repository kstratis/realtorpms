class ChangePropertyActiveDefault < ActiveRecord::Migration[6.1]
  def change
    change_column_default :properties, :active, true
  end
end
