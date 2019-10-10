class AddSlugToFields < ActiveRecord::Migration[5.2]
  def change
    add_column :entity_fields, :slug, :string
  end
end
