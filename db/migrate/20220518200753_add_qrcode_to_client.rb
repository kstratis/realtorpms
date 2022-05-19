class AddQrcodeToClient < ActiveRecord::Migration[6.1]
  def change
    add_column :clients, :qrcode, :text
  end
end
