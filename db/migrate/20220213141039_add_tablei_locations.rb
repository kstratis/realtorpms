class AddTableiLocations < ActiveRecord::Migration[6.1]
  def change
    create_table :ilocations do |t|
      t.string :area
      t.references :account, index: true, foreign_key: true

      t.timestamps
    end
  end
end
