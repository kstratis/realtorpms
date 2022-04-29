class Property < ApplicationRecord
  extend FriendlyId
  include Searchable

  include Filterable

  after_destroy :destroy_orphan_ilocations

  # History module is used for the redirects
  friendly_id :unique_identifier, use: [:slugged, :finders, :history]

  # Use the identifier method to get a uid
  # If non-unique identifier is occurred, append the property id
  def unique_identifier
    [
        :identifier,
        [:identifier, :id]
    ]
  end

  def identifier
    ranged = ('1'..'9').to_a
    prefix = 'PR'
    # PublicUid comes from a separate gem
    prefix + PublicUid::Generators::RangeString.new(5, ranged).generate
  end

  attr_searchable %w(slug title description notes adxe adspitogatos)

  # before_save happens after validation that's why we use before_validation
  before_validation :handle_dependent_extra_fields, on: :update
  before_validation :handle_dependent_energy_field, on: :update

  # before_save happens after validation that's why we use before_validation
  before_validation do
    if account.present?
      self.model_type = account.model_types.find_by(name: 'properties')
    end
  end

  # This is for existing log records
  # https://stackoverflow.com/a/9326882/178728
  # before_destroy { |record| Log.where(property: record).update_all(property_name: record.slug) }

  belongs_to :account
  belongs_to :category

  # A property may either belong to :location or :ilocation (international location)
  belongs_to :location, optional: true
  belongs_to :ilocation, optional: true

  belongs_to :model_type
  has_and_belongs_to_many :favlists, -> { distinct }


  has_many :assignments
  has_many_attached :images
  has_one_attached :avatar
  has_and_belongs_to_many :extras
  # CPA stands for Client-Property-Association (many-to-many join table)
  has_many :cpas, inverse_of: :property, dependent: :destroy
  has_many :clients, -> { order('cpas.updated_at').select('clients.*, cpas.updated_at').distinct }, through: :cpas

  accepts_nested_attributes_for :clients, reject_if: :all_blank, allow_destroy: true

  # The following scopes are only used at client website
  scope :filter_by_businesstype, -> (businesstype) do
    if (businesstype == 'sell_rent') || businesstype.blank?
      where('businesstype = ?', Property.businesstypes[:sell]).or(where('businesstype = ?', Property.businesstypes[:rent]))
    else
      public_send(businesstype)
    end
  end
  scope :filter_by_category, -> (category) { joins(:category).where(categories: { parent_slug: category }) }
  scope :filter_by_location, -> (location_id) { where location_id: location_id }
  scope :filter_by_ilocation, -> (ilocation_id) { where ilocation_id: ilocation_id }

  scope :filter_by_pricemin, -> (pricemin) { where("price >= ?", pricemin) }
  scope :filter_by_pricemax, -> (pricemax) { where("price <= ?", pricemax) }

  scope :website_enabled, -> { where website_enabled: true }
  scope :pinned, -> { where pinned: true }

  def cpas_attributes=(cpa_attributes)
    cpa_attributes.values.each do |client_attribute|
      client = Client.find_or_create_by(name: client_attribute["client_attributes"]["email"])
      self.clients << client
    end
  end

  # https://stackoverflow.com/a/38845388/178728
  # https://stackoverflow.com/a/14231213/178728
  # This basically sorts assignments by assignment updated_at column so that each change is reflected last on the list
  has_many :users, -> {order('assignments.updated_at').select('users.*, assignments.updated_at as assignment_updated_at').distinct}, through: :assignments, dependent: :destroy
  has_many :favorites, dependent: :destroy
  has_many :logs, dependent: :nullify


  # Collection of properties which have been favorited by a particular user
  scope :faved_by, -> (user) {joins(:favorites).where(favorites: {user: user})}

  attr_accessor :categoryid, :locationid, :ilocationid, :clientid, :noclient, :delete_images

  enum businesstype: [:sell, :rent, :sell_rent]

  enum energy_cert: [:a_plus, :a, :b_plus, :b, :c, :d, :e, :z, :h]

  enum floor: [:basement, :semi_basement, :ground_floor, :mezzanine].concat(Array(1..50).map(&:to_s).map(&:to_sym))

  # Validations should match their ujs_form_handler.js counterparts
  validates :businesstype, presence: true
  # validates :category, presence: true
  # validates :subcategory, presence: true
  # validates :locationid, presence: true
  validates :size, numericality: { only_integer: true }, allow_blank: true
  validates :price, numericality: { only_integer: true }, allow_blank: false
  validates :bedrooms, numericality: { only_integer: true }, allow_blank: true
  validates :bathrooms, numericality: { only_integer: true }, allow_blank: true
  # Look only for iframes
  validates :map_url, format: { with: /(?:<iframe[^>]*)(?:(?:\/>)|(?:>.*?<\/iframe>))/i }, if: -> { map_url.present? }

  DEFAULT_ATTRIBUTE_RENDER_FN = Proc.new { |value| value.blank? ? '—' : value }

  def pricepersqmeter
    (price / size.to_f).ceil.to_s unless price.blank? || size.blank? || size == 0
  end

  class << self


    # def search(search, filter)
      # DEBUG
      # puts "Model method running with search term: #{search}"
      # if search
      #   where('slug ILIKE ?', "%#{search}%").limit(5)
      # end
    # end

    # def landlord_features
    #   {
    #       :landlord_name => {:label => 'owner', :icon => 'client', :options => 'full_name', :renderfn => DEFAULT_ATTRIBUTE_RENDER_FN},
    #       # :landlord_tel => {:label => 'contact', :icon => 'tel', :options => 'telephones', :renderfn => Proc.new {|value| value.blank? ? '—' : value.split(/[\s,]+/).collect(&:strip).join(', ')}}
    #       :landlord_tel => {:label => 'contact', :icon => 'tel', :options => 'telephones', :renderfn => Proc.new {|value| value.blank? ? '—' : value}}
    #   }.freeze
    # end

    def basic_features(account)
      {
          :businesstype => {:label => 'businesstype', :icon => 'businesstype', :options => nil, :renderfn => Proc.new {|value| value.blank? ? '—' : '<mark class="highlighted">'+ I18n.t("activerecord.attributes.property.enums.businesstype.#{value}") + '</mark>'} },
          :category_info => {:label => 'subcategory', :icon => 'subcategory', :options => 'slug', :renderfn => Proc.new {|value| value.blank? ? '—' : I18n.t("activerecord.attributes.property.enums.subcategory.#{value}")} },
          #:location_info => {:label => 'location', :icon => 'location', :options => 'localname', :renderfn => DEFAULT_ATTRIBUTE_RENDER_FN},
          :size => {:label => 'size', :icon => 'size', :options => nil, :renderfn => Proc.new {|value| value ? I18n.t('activerecord.attributes.property.size_meter_html', size: value.to_s) : '—' }},
          :price => {:label => 'price', :icon => 'price', :options => nil, :renderfn => Proc.new {|value| value ? ActionController::Base.helpers.number_to_currency(value, precision: 0, round_mode: :up) : '—' }},
          :pricepersqmeter => {:label => 'pricepersqmeter', :icon => 'pricepersqmeter', :options => nil, :renderfn => Proc.new {|value| value ? ActionController::Base.helpers.number_to_currency(value, precision: 0, round_mode: :up) : '—' }},
          :created_at => {:label => 'created_at', :icon => 'created_at', :options => nil, :renderfn => Proc.new {|value| value ? (I18n.l value, format: :custom) : '—' } },
          :map_url => {:label => 'location', :icon => 'location', :options => nil, :renderfn => Proc.new {|value| "<button type='button' class='btn btn-secondary btn-sm printable' data-url='#{value.blank? ? '' : Property.iframe_parse(value) }' #{value.blank? ? 'disabled' : nil }><i class='fas fa-map fa-fw'></i></button>&nbsp;&nbsp;&nbsp;#{value.blank? ? "<span class='property-cover-popover' data-toggle='popover' data-placement='top' data-trigger='hover' data-content='#{I18n.t('properties.map_feedback')}'><i class='fas fa-info-circle'></i></span>" : nil}"}},
          :active => {:label => 'status', :icon => 'status', :options => nil, :renderfn => Proc.new {|value| value ? "#{I18n.t('activerecord.attributes.property.status_active')} <div class='indicator indicator-on'></div>" : "#{I18n.t('activerecord.attributes.property.status_inactive')} <div class='indicator indicator-off'></div>"}}
      }.freeze
    end

    def extended_features(account)
      extended = {
          :bedrooms => {:label => 'bedrooms', :icon => 'bedrooms', :options => nil, :renderfn => DEFAULT_ATTRIBUTE_RENDER_FN},
          :bathrooms => {:label => 'bathrooms', :icon => 'bathrooms', :options => nil, :renderfn => DEFAULT_ATTRIBUTE_RENDER_FN},
          :floor => {:label => 'floor', :icon => 'floor', :options => nil, :renderfn => Proc.new {|value| value.blank? ? '—' : I18n.t("activerecord.attributes.property.enums.floor.#{value}")}},
          # :render_extra => {:label => 'parking', :icon => 'parking', :options => 'parking', :renderfn => Proc.new {|value| value.blank? ? I18n.t('false') : I18n.t('true')}}, # Casting tip see here: https://stackoverflow.com/a/44322375/178728
          :construction => {:label => 'construction', :icon => 'construction', :options => nil, :renderfn => DEFAULT_ATTRIBUTE_RENDER_FN},
          :address => {:label => 'address', :icon => 'address', :options => nil, :renderfn => DEFAULT_ATTRIBUTE_RENDER_FN},
          :availability => {:label => 'availability', :icon => 'availability', :options => nil, :renderfn => Proc.new {|value| value ? (I18n.l value, format: :showings) : '—' }}
          # :owner_info => {:label => 'owner', :icon => 'client', :options => 'full_name', :renderfn => DEFAULT_ATTRIBUTE_RENDER_FN}
      }
      if account.greek?
        extended.merge(:energy_cert => {:label => 'energy_cert', :icon => 'energy_cert', :options => nil, :renderfn => Proc.new {|value| value.blank? ? '—' : '<mark class="highlighted">'+ I18n.t("activerecord.attributes.property.enums.energy_cert.#{value}") + '</mark>'} },)
      else
        extended.reverse_merge(:unit => {:label => 'unit', :icon => 'unit', :options => nil, :renderfn => DEFAULT_ATTRIBUTE_RENDER_FN })
      end
    end
  end

  # def landlord_info(term)
  #   clients.each { |c| c.try(term.to_sym)}
  # end
  #
  # alias_method :landlord_name, :landlord_info
  # alias_method :landlord_tel, :landlord_info

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

  def self.iframe_parse(iframe_tag)
    begin
      # Exceptions raised by this code will
      # be caught by the following rescue clause
      Nokogiri::HTML(iframe_tag).search('iframe').attribute('src').value || nil
    rescue
      puts "Nokogiri exception occured while parsing the following iframe tag (map_url attribute): #{iframe_tag}"
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
  def dropdown_description
    "#{slug.upcase} - #{self.category.localname} #{price ? ' - ' + ActionController::Base.helpers.number_to_currency(price).to_s : ''}"
  end

  def viewable_dropdown_clients(account, user)
    clients.map do |c|
      { 'label': c.full_name,
        'value': c.id,
        isFixed: option_meta(account, user, c) }
    end
  end

  def render_owner(user, client, account)
    if user.clients.where(account: account).exists?(client.id) || user.is_admin?(account)
      :link
    elsif user.properties.where(account: account).exists?(id)
      :text
    else
      :none
    end
  end

  private

  # Determine whether an owner can be removed when editing a property
  def option_meta(account, user, client)
    return false if user.is_admin?(account)

    !user.client_ids.include?(client.id)
  end

  # In the 'compound' extra fields for roofdeck, storage, garden and plot where each one comes with its own input,
  # make sure that if unchecked on update action, the existing input value will also be cleared.
  def handle_dependent_extra_fields
    edited_extras = extras.reject { |c| c.blank? }.collect { |extra| Extra.find(extra.id).name }
    set_diff = %w(roofdeck storage garden plot) - edited_extras
    set_diff.each do |el|
      # DEBUG
      # puts "the property is: #{el + '_space'}"
      # MIND THAT THIS won't do any validations or update the updated_at attribute
      write_attribute(:"#{el + '_space'}", nil)
    end
  end

  def handle_dependent_energy_field
    return if has_energy_cert?

    write_attribute(:energy_cert, nil)
  end

  def destroy_orphan_ilocations
    return unless orphan_ilocation?

    self.ilocation.destroy!
  end

  def orphan_ilocation?
    self.account.properties.joins(:ilocation).where(ilocations: { area: self.ilocation.area }).empty?
  end
end
