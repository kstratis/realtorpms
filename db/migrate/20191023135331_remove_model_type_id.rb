class RemoveModelTypeId < ActiveRecord::Migration[5.2]
  def change
    remove_column :users, :model_type_id
  end
end
