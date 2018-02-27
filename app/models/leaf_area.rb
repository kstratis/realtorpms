class LeafArea < ApplicationRecord
  belongs_to :branch_area, foreign_key: 'branch_area_id', primary_key: 'area_id', optional: true
end
