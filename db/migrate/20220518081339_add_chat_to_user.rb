class AddChatToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :chat, :boolean, default: false
  end
end
