class AddCatergoryToExtras < ActiveRecord::Migration[5.2]
  def change
    add_column :extras, :subtype, :string

  end
end
