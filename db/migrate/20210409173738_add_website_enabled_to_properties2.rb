class AddWebsiteEnabledToProperties2 < ActiveRecord::Migration[6.1]
  def change
    change_column_default :properties, :website_enabled, true
  end
end
