class AddIlocationToProperties < ActiveRecord::Migration[6.1]
  def change
    add_reference :properties, :ilocation, foreign_key: true, index: true
  end
end
