class Location < ApplicationRecord
  belongs_to :country
  has_many :properties
end
