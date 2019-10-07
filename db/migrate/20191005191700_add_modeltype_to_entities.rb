class AddModeltypeToEntities < ActiveRecord::Migration[5.2]
  def change
    add_column :properties, :model_type_id, :integer
  end
end
