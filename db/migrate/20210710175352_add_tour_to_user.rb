class AddTourToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :has_taken_tour, :boolean, default: false
  end
end
