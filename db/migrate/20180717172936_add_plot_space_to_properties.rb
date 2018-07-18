class AddPlotSpaceToProperties < ActiveRecord::Migration[5.2]
  def change
    add_column :properties, :plot_space, :string
  end
end
