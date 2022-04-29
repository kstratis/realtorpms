class AddSampleAttributeToProperty < ActiveRecord::Migration[6.1]
  def change
    add_column :properties, :sample, :boolean, default: false
  end
end
