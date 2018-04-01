class AddBusinessType < ActiveRecord::Migration[5.2]
  def change
    add_column :properties, :businesstype, :integer
  end
end
