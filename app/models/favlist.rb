class Favlist < ApplicationRecord
  belongs_to :user
  has_many :properties

  def faved

  end
end
