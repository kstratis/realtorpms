class Property < ApplicationRecord
  belongs_to :user
  validates :description, length: { maximum: 250 }
end
