class CreateJoinTableExtrasProperty < ActiveRecord::Migration[5.2]
  def change
    create_join_table :extras, :properties do |t|
      # t.index [:extra_id, :property_id]
      # t.index [:property_id, :extra_id]
    end
  end
end
