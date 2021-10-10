class AddPinToProperties < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :pinned, :boolean, default: false
  end
end
