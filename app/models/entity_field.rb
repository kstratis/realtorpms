class EntityField < ApplicationRecord
  belongs_to :model_type
  default_scope { order(:created_at) }
end
