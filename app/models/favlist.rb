class Favlist < ApplicationRecord
  validates :name, uniqueness: { case_sensitive: false }
  belongs_to :user
  has_and_belongs_to_many :properties, -> { distinct }


  # scope :with_param, -> (property) { property ? <code to filterx> : xalxxzl }

  # If a single property is faved by a particular favlist
  def has_faved?(property_id)
    puts properties.exists?(property_id)
    properties.exists?(property_id)
  end
end
