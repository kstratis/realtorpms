class HasBelongsFavlists < ActiveRecord::Migration[5.2]
  def change
    remove_column :favlists, :user_id
    create_table :favlists_properties, id: false do |t|
      t.belongs_to :favlist, index: true
      t.belongs_to :property, index: true
    end
  end
end
