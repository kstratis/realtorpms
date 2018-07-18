class AddAdsToProperties < ActiveRecord::Migration[5.2]
  def change
    add_column :properties, :adxe, :string
    add_column :properties, :adspitogatos, :string
  end
end
