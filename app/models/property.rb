class Property < ApplicationRecord
  # belongs_to :user
  belongs_to :account
  has_many :assignments
  # https://stackoverflow.com/a/38845388/178728
  has_many :users, -> { distinct }, through: :assignments, dependent: :destroy

  enum type: [:neoclassical, :protected_property, :loft, :traditional, :villa, :stone,  :studio,
              :prefabricated, :precast]
  enum orientation: [:front_facing, :airy, :on_corner, :inwards_facing]
  enum view: [:sea, :mountain, :forest, :infinite]
  enum heating: [:central, :split]
  validates :description, length: { maximum: 250 }
end
