class Property < ApplicationRecord
  # belongs_to :user
  belongs_to :account
  belongs_to :location, optional: true
  has_many :assignments
  has_many_attached :images
  # https://stackoverflow.com/a/38845388/178728
  has_many :users, -> { distinct }, through: :assignments, dependent: :destroy
  attr_accessor :locationid


  # enum propertycategory: [:apartment, :terraced, :maisonette, :building, :home]
  #
  enum businesstype: [:sell, :rent, :sell_rent]

  enum category: [:residential, :commercial, :land, :other]

  enum subcategory: [:apartment, :studio, :maisonette, :detached_house, :villa, :loft, :bungalow, :building, :apartment_complex,
                     :office, :public_store, :warehouse, :industrial_space, :craft_space, :hotel, :business_building, :hall, :showroom,
                     :land_plot, :parcels, :island, :other_categories,
                     :parking, :business, :prefabricated, :detachable, :air, :other_various]
  # enum residentialsubcategory: [:apartment, :studio, :maisonette, :detached, :villa, :loft, :bungalow, :building, :complex]
  # enum commercialsubcategory: [:office, :commercialstore, :warehouse, :industrial, :craft, :hotel, :commercialbusiness, :hall, :showroom]
  # enum landsubcategory: [:plot, :parcels, :island, :othercategories]
  # enum othersubcategory: [:parking, :unitbusiness, :prefabricated, :detachable, :air, :othersubcategory]
  # enum residentialsubcategory: [:apartment, :terraced, :maisonette, :building, :home]
  # enum type: [:neoclassical, :protected_property, :loft, :traditional, :villa, :stone,  :studio,
  #             :prefabricated, :precast]
  enum orientation: [:front_facing, :airy, :on_corner, :inwards_facing]
  enum view: [:sea, :mountain, :forest, :infinite]
  enum heating: [:central, :prive]

  # Validations should match their ujs_form_handler.js counterparts
  validates :businesstype, presence: true
  validates :category, presence: true
  validates :subcategory, presence: true
  validates :locationid, presence: true
  validates :size, numericality: { only_integer: true }, allow_blank: true
  validates :price, numericality: { only_integer: true }, allow_blank: true
  validates :bedrooms, numericality: { only_integer: true }, allow_blank: true
  validates :bathrooms, numericality: { only_integer: true }, allow_blank: true


end
