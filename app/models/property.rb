class Property < ApplicationRecord
  before_validation :handle_dependent_fields, on: :update
  # belongs_to :user
  belongs_to :account
  belongs_to :location, optional: true
  has_many :assignments
  has_many_attached :images
  has_and_belongs_to_many :extras
  # https://stackoverflow.com/a/38845388/178728
  has_many :users, -> { distinct }, through: :assignments, dependent: :destroy
  has_many :favorites, dependent: :destroy

  # Collection of properties which have been favorited by a particular user
  scope :faved_by, -> (user) { joins(:favorites).where(favorites: { user: user }) }

  attr_accessor :locationid

  # enum propertycategory: [:apartment, :terraced, :maisonette, :building, :home]

  enum businesstype: [:sell, :rent, :sell_rent]

  enum category: [:residential, :commercial, :land, :other]

  enum subcategory: [:apartment, :studio, :maisonette, :detached_housee, :villa, :loft, :bungalow, :building, :apartment_complex,
                     :office, :public_store, :warehouse, :industrial_space, :craft_space, :hotel, :business_building, :hall, :showroom,
                     :land_plot, :parcels, :island, :other_categories,
                     :parking, :business, :prefabricated, :detachable, :air, :other_various]
  # enum residentialsubcategory: [:apartment, :studio, :maisonette, :detached, :villa, :loft, :bungalow, :building, :complex]
  # enum commercialsubcategory: [:office, :commercialstore, :warehouse, :industrial, :craft, :hotel, :commercialbusiness, :hall, :showroom]
  # enum landsubcategory: [:plot, :parcels, :island, :othercategories]
  # enum othersubcategory: [:parking, :unitbusiness, :prefabricated, :detachable, :air, :othersubcategory]
  # enum residentialsubcategory: [:apartment, :terraced, :maisonette, :building, :home]
  # enum subtype: [:neoclassical, :protected_pr, :loft_pr, :traditional, :villa_pr, :stone,  :studio_pr,
  #             :prefabricated_pr, :precast_pr]
  enum floor: [:basement, :semi_basement, :ground_floor, :mezzanine].concat(Array(1..50).map(&:to_s).map(&:to_sym))
  # enum orientation: [:facade, :airy, :on_corner, :inwards_facing]
  # enum view: [:sea, :mountain, :forest, :infinite]
  # enum heating: [:central, :prive]

  # Validations should match their ujs_form_handler.js counterparts
  validates :businesstype, presence: true
  validates :category, presence: true
  validates :subcategory, presence: true
  # validates :locationid, presence: true
  validates :size, numericality: { only_integer: true }, allow_blank: true
  validates :price, numericality: { only_integer: true }, allow_blank: true
  validates :bedrooms, numericality: { only_integer: true }, allow_blank: true
  validates :bathrooms, numericality: { only_integer: true }, allow_blank: true

  def pricepersqmeter
    (price / size).to_s unless price.blank? || size.blank? || size == 0
  end

  # If a single property is faved by anyone at all
  def faved?(property)
    favorites.find_by(property_id: property.id).present?
  end

  # If a single property is faved by a particular user
  def is_faved_by?(user)
    favorites.find_by(user_id: user.id).present?
  end

  # We use the postgres unaccent to cater for unicode accents and ilike for case insensitive searches
  # https://gist.github.com/jfragoulis/9914900
  def self.search(search)
    if search
      where('unaccent(last_name) ILIKE unaccent(?)', "%#{search}%").or(where('unaccent(first_name) ILIKE unaccent(?)', "%#{search}%")).or(where('email LIKE ?', "%#{search}%"))
    end
  end

  private

    # In the 'compound' extra fields for roofdeck, storage, garden and plot where each comes with its own input,
    # make sure that if unchecked on update action, the existing input value will also be cleared.
    def handle_dependent_fields
      edited_extras = extras.reject { |c| c.blank? }.collect { |extra| Extra.find(extra.id).name }
      set_diff = %w(roofdeck storage garden plot) - edited_extras
      set_diff.each do |el|
        # DEBUG
        # puts "the property is: #{el + '_space'}"
        # This won't do any validations or update the updated_at attribute
        write_attribute(:"#{el + '_space'}", nil)
      end
    end

end
