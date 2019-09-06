class Property < ApplicationRecord

  include Searchable

  attr_searchable %w(title description notes adxe adspitogatos landlord.last_name landlord.telephones)

  before_validation :handle_dependent_fields, on: :update
  # belongs_to :user
  belongs_to :account
  belongs_to :category
  belongs_to :location
  belongs_to :landlord, optional: true
  has_and_belongs_to_many :favlists, -> {distinct}
  accepts_nested_attributes_for :landlord
  has_many :assignments
  has_many_attached :images
  has_one_attached :avatar
  has_and_belongs_to_many :extras

  # https://stackoverflow.com/a/38845388/178728
  # https://stackoverflow.com/a/14231213/178728
  # This basically sorts assignments by assignment updated at column so that each change is reflected last on the list
  has_many :users, -> {order('assignments.updated_at').select('users.*, assignments.updated_at as assignment_updated_at').distinct}, through: :assignments, dependent: :destroy
  has_many :favorites, dependent: :destroy

  # Collection of properties which have been favorited by a particular user
  scope :faved_by, -> (user) {joins(:favorites).where(favorites: {user: user})}

  attr_accessor :categoryid, :locationid, :landlordid, :nolandlord, :delete_images

  enum businesstype: [:sell, :rent, :sell_rent]

  enum floor: [:basement, :semi_basement, :ground_floor, :mezzanine].concat(Array(1..50).map(&:to_s).map(&:to_sym))

  # Validations should match their ujs_form_handler.js counterparts
  validates :businesstype, presence: true
  # validates :category, presence: true
  # validates :subcategory, presence: true
  # validates :locationid, presence: true
  validates :size, numericality: {only_integer: true}, allow_blank: true
  validates :price, numericality: {only_integer: true}, allow_blank: true
  validates :bedrooms, numericality: {only_integer: true}, allow_blank: true
  validates :bathrooms, numericality: {only_integer: true}, allow_blank: true
  # Look only for iframes
  validates :map_url, format: { with: /(?:<iframe[^>]*)(?:(?:\/>)|(?:>.*?<\/iframe>))/i }, if: -> { map_url.present? }


  DEFAULT_ATTRIBUTE_RENDER_FN = Proc.new {|value| value.blank? ? '—' : value}

  def pricepersqmeter
    (price / size.to_f).ceil.to_s unless price.blank? || size.blank? || size == 0
  end

  class << self

    def landlord_features
      {
          :landlord_name => {:label => 'owner', :icon => 'client', :options => 'full_name', :renderfn => DEFAULT_ATTRIBUTE_RENDER_FN},
          :landlord_tel => {:label => 'contact', :icon => 'tel', :options => 'telephones', :renderfn => Proc.new {|value| value.blank? ? '—' : value.split(/[\s,]+/).collect(&:strip).join(', ')}}
      }.freeze
    end

    def basic_features
      {
          :businesstype => {:label => 'businesstype', :icon => 'businesstype', :options => nil, :renderfn => Proc.new {|value| value.blank? ? '—' : '<mark class="highlighted">'+ I18n.t("activerecord.attributes.property.enums.businesstype.#{value}") + '</mark>'} },
          :location_info => {:label => 'location', :icon => 'location', :options => 'localname', :renderfn => DEFAULT_ATTRIBUTE_RENDER_FN},
          :price => {:label => 'price', :icon => 'price', :options => nil, :renderfn => Proc.new {|value| value ? ActionController::Base.helpers.number_to_currency(value) : '—' }},
          :pricepersqmeter => {:label => 'pricepersqmeter', :icon => 'pricepersqmeter', :options => nil, :renderfn => Proc.new {|value| value ? ActionController::Base.helpers.number_to_currency(value) : '—' }},
          :size => {:label => 'size', :icon => 'size', :options => nil, :renderfn => Proc.new {|value| value ? I18n.t('activerecord.attributes.property.size_meter_html', size: value.to_s) : '—' }},
          :category_info => {:label => 'subcategory', :icon => 'subcategory', :options => 'slug', :renderfn => Proc.new {|value| value.blank? ? '—' : I18n.t("activerecord.attributes.property.enums.subcategory.#{value}")} },
          :created_at => {:label => 'created_at', :icon => 'created_at', :options => nil, :renderfn => Proc.new {|value| value ? (I18n.l value, format: :custom) : '—' } }

      }.freeze
    end

    def extended_features
      {
          :bedrooms => {:label => 'bedrooms', :icon => 'bedrooms', :options => nil, :renderfn => DEFAULT_ATTRIBUTE_RENDER_FN},
          :bathrooms => {:label => 'bathrooms', :icon => 'bathrooms', :options => nil, :renderfn => DEFAULT_ATTRIBUTE_RENDER_FN},
          :floor => {:label => 'floor', :icon => 'floor', :options => nil, :renderfn => Proc.new {|value| value.blank? ? '—' : I18n.t("activerecord.attributes.property.enums.floor.#{value}")}},
          # :render_extra => {:label => 'parking', :icon => 'parking', :options => 'parking', :renderfn => Proc.new {|value| value.blank? ? I18n.t('false') : I18n.t('true')}}, # Casting tip see here: https://stackoverflow.com/a/44322375/178728
          :construction => {:label => 'construction', :icon => 'construction', :options => nil, :renderfn => DEFAULT_ATTRIBUTE_RENDER_FN},
          :address => {:label => 'address', :icon => 'address', :options => nil, :renderfn => DEFAULT_ATTRIBUTE_RENDER_FN},
          :availability => {:label => 'availability', :icon => 'availability', :options => nil, :renderfn => Proc.new {|value| value ? (I18n.l value, format: :custom) : '—' }}
          # :owner_info => {:label => 'owner', :icon => 'client', :options => 'full_name', :renderfn => DEFAULT_ATTRIBUTE_RENDER_FN}
      }.freeze
    end
  end

  def landlord_info(term)
    landlord.try(term.to_sym)
  end

  alias_method :landlord_name, :landlord_info
  alias_method :landlord_tel, :landlord_info

  def location_info(term)
    location.try(term.to_sym)
  end

  def category_info(term)
    category.try(term.to_sym)
  end

  def render_extra(term)
    extras.exists?(Extra.find_by(name: term.to_s).id)
  end

  # def render_extras
  #   extras.each do ||
  # end

  def all_images
    if avatar.attached?
      images.to_a.unshift(avatar)
    else
      images
    end
  end

  def map_href
    begin
      # Exceptions raised by this code will
      # be caught by the following rescue clause
      Nokogiri::HTML(map_url).search('iframe').attribute('src').value || nil
    rescue
      puts "Exception while parsing the property's #{id} map url"
      return nil
    end


  end

  # def handlers
  #   if users.count > 0
  #
  #
  #   end
  #
  # end

  # If a single property is faved by anyone at all
  # def faved?(property, favlist)
  #   current_user.favlists.find(favlist).properties.find_by(property_id: property.id).present?
  # end

  # def faved?(property)
  #   favorites.find_by(property_id: property.id).present?
  # end

  # If a single property is faved by a particular user
  # def is_faved_by?(user)
  #   favorites.find_by(user_id: user.id).present?
  # end

  private

  # In the 'compound' extra fields for roofdeck, storage, garden and plot where each one comes with its own input,
  # make sure that if unchecked on update action, the existing input value will also be cleared.
  def handle_dependent_fields
    edited_extras = extras.reject {|c| c.blank?}.collect {|extra| Extra.find(extra.id).name}
    set_diff = %w(roofdeck storage garden plot) - edited_extras
    set_diff.each do |el|
      # DEBUG
      # puts "the property is: #{el + '_space'}"
      # MIND THAT THIS won't do any validations or update the updated_at attribute
      write_attribute(:"#{el + '_space'}", nil)
    end
  end

end
