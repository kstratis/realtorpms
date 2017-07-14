class CreateUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :users do |t|
      t.string :email
      t.string :first_name
      t.string :last_name
      t.integer :age
      t.integer :phone1
      t.integer :phone2
      t.string :office_branch

      t.timestamps
    end
  end
end
