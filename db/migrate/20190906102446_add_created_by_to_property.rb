class AddCreatedByToProperty < ActiveRecord::Migration[5.2]
  def change
    add_reference :properties, :user, foreign_key: true, index: true
  end
end
