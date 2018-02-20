class BranchArea < ApplicationRecord
  belongs_to :root_area
  has_many :leaf_areas
end
