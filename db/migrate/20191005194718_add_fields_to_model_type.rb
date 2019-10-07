class AddFieldsToModelType < ActiveRecord::Migration[5.2]
  def change
    add_reference :entity_fields, :model_type
  end
end
