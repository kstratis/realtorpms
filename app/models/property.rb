class Property < ApplicationRecord
  belongs_to :user
  enum type: [:neoclassical, :protected_property, :loft, :traditional, :villa, :stone,  :studio,
              :prefabricated, :precast]
  enum orientation: [:front_facing, :airy, :on_corner, :inwards_facing]
  enum view: [:sea, :mountain, :forest, :infinite]
  enum heating: [:central, :split]
  validates :description, length: { maximum: 250 }
end
