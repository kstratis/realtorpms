class RemoveCustomFieldsProperty < ActiveRecord::Migration[5.2]
  def change
    remove_column :entity_fields, :property_id
  end
end
