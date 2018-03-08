class Property < ApplicationRecord
  # belongs_to :user
  belongs_to :account
  belongs_to :location, optional: true
  has_many :assignments
  has_many_attached :images
  # https://stackoverflow.com/a/38845388/178728
  has_many :users, -> { distinct }, through: :assignments, dependent: :destroy

  enum propertycategory: [:apartment, :terraced, :maisonette, :building, :home]
  enum propertytype: [:neoclassical, :protected_property, :loft, :traditional, :villa, :stone,  :studio,
              :prefabricated, :precast]
  enum orientation: [:front_facing, :airy, :on_corner, :inwards_facing]
  enum view: [:sea, :mountain, :forest, :infinite]
  enum heating: [:central, :prive]
  validates :description, length: { maximum: 250 }, presence: true
  validates :propertytype, presence: true
end
