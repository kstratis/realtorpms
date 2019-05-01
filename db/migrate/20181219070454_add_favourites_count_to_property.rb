class AddFavouritesCountToProperty < ActiveRecord::Migration[5.2]
  def change
    add_column :properties, :favorites_count, :integer
  end
end
