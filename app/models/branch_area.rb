class BranchArea < ApplicationRecord
  belongs_to :root_area, foreign_key: 'root_area_id', primary_key: 'area_id', optional: true
  has_many :leaf_areas, foreign_key: 'branch_area_id', primary_key: 'area_id'
end
