class DeleteLandlords < ActiveRecord::Migration[5.2]
  def change
    drop_table(:landlords, force: true) if ActiveRecord::Base.connection.tables.include?('landlords')
  end
end
