class CreateCalendarEvents < ActiveRecord::Migration[6.0]
  def change
    create_table :calendar_events do |t|
      t.string :description
      t.datetime :created_for, index: true
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
