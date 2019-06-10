class Favlist < ApplicationRecord
  validates :name, uniqueness: { case_sensitive: false }
  belongs_to :user
  has_and_belongs_to_many :properties, -> { distinct }

  # If a single property is faved by a particular favlist
  def has_faved?(property)
    properties.find_by(property: property).present?
  end
end
