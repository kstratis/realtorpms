class CreateClients < ActiveRecord::Migration[5.2]
  def change
    create_table :clients do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :telephones
      t.string :job
      t.references :account, index: true, foreign_key: true

      t.timestamps
    end
    add_index :clients, :last_name
  end
end
