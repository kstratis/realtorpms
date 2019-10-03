class CreateEntityFields < ActiveRecord::Migration[5.2]
  def change
    create_table :entity_fields do |t|
      t.string :name
      t.string :field_type
      t.boolean :required
      t.belongs_to :property, foreign_key: true

      t.timestamps
    end
  end
end
