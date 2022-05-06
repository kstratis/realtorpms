class RenameCoverage < ActiveRecord::Migration[6.1]
  def change
    rename_column :properties, :coverage_ration, :coverage_ratio
  end
end
