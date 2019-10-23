class AddModelTypesUsers < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :users, :model_types
    create_table :model_types_users do |t|
      t.belongs_to :model_type
      t.belongs_to :user
    end
  end
end
