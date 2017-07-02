class CreateProperties < ActiveRecord::Migration[5.1]
  def change
    create_table :properties do |t|
      t.text :description
      t.integer :user_id

      t.timestamps
    end
  end
end
