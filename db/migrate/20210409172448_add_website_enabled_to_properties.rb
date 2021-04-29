class AddWebsiteEnabledToProperties < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :website_enabled, :boolean
  end
end
