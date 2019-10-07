class CreateModelTypes < ActiveRecord::Migration[5.2]
  def change
    create_table :model_types do |t|
      t.string :name
      t.references :account, index: true, foreign_key: true

      t.timestamps
    end
  end
end
