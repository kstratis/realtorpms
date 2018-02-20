class RootArea < ApplicationRecord
  has_many :branch_areas, foreign_key: 'root_area_id', primary_key: 'area_id'
end
