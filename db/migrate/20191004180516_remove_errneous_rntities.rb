class RemoveErrneousRntities < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :entity_fields, :property
  end
end
