class AddSpitogatosConf < ActiveRecord::Migration[6.1]
  def change
    create_table :spitogatos do |t|
      t.string :email
      t.string :username
      t.string :password
      t.string :broker_id

      t.references :account, index: true, foreign_key: true

      t.timestamps
    end
  end
end
