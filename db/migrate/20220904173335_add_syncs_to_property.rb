class AddSyncsToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :spitogatos_data_sync_needed, :boolean, default: false
    add_column :properties, :spitogatos_images_sync_needed, :boolean, default: false
  end
end
