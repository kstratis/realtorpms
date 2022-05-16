class AddDescriptionEnToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :description_en, :text
  end
end
