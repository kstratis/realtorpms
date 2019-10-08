class ChangeJsonDefault < ActiveRecord::Migration[5.2]
  def change
    change_column_default :properties, :preferences, {}
  end
end
