class AddShowingDatetimeToCpas < ActiveRecord::Migration[5.2]
  def change
    add_column :cpas, :showing_date, :datetime
  end
end
