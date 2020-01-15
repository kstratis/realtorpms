class User < ApplicationRecord

  include Searchable

  attr_searchable %w(first_name last_name email)

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i  # checks the email format

  self.per_page = 10 # This is for pagination
  attr_accessor :remember_token, :reset_token

  before_save { self.email = email.downcase }  # makes sure everything is lower case
  before_create { self.color = COLOR_PALETTE.sample } # This assigns a random bg color to each new user

  # This is for existing log records. A user may also be an action author (user object again) thus we need to handle
  # that as well.
  # https://stackoverflow.com/a/9326882/178728
  before_destroy { |record| Log.where(author_id: record).update_all(author_id: nil) }

  validates :first_name, presence: true, length: { maximum: 50 }
  validates :last_name, presence: true, length: { maximum: 50 }
  validates :email, presence: true, length: { maximum: 255 },
            format: { with: VALID_EMAIL_REGEX },
            uniqueness: { case_sensitive: false }
  has_secure_password
  validates :password, presence: true, length: { minimum: 6 }, allow_nil: true

  # Deleting a given user -provided he is the owner of an account- cascades and deletes all his related data including,
  # properties, user assignments, favorites and attachments
  has_one :account, dependent: :destroy, foreign_key: "owner_id"

  has_many :memberships
  has_many :accounts, through: :memberships, dependent: :destroy

  has_many :assignments
  # https://stackoverflow.com/a/38845388/178728
  has_many :properties, -> { distinct }, through: :assignments, dependent: :destroy

  has_many :clientships
  # https://stackoverflow.com/a/38845388/178728
  has_many :clients, -> { distinct }, through: :clientships, dependent: :destroy

  has_many :favorites, dependent: :destroy
  has_many :favlists, dependent: :destroy
  has_many :logs, dependent: :nullify
  has_one_attached :avatar
  has_and_belongs_to_many :model_types, -> {distinct}

  # has_many :properties, -> (account) { where('account_id = ?', account.id) }, through: :assignments

  # Basically class methods defined as instance methods in the singleton class
  class << self
    # Returns the hash digest of the given string.
    def digest(string)
      cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST : BCrypt::Engine.cost
      BCrypt::Password.create(string, cost: cost)
    end

    # Returns a random token.
    def new_token
      SecureRandom.urlsafe_base64
    end

    def lng_list
      [[I18n.t('languages.english'), 'en'], [I18n.t('languages.greek'), 'el']]
    end

  end

  # 1 if the user owns an account (paying customer).
  # 0 otherwise
  def has_owning_accounts?
    Account.find_by(owner_id: self.id) ? 1 : 0
  end

  # How many accounts this user belongs to (as a user)
  def get_membership_accounts
    self.accounts.count
  end

  def get_account_count
    has_owning_accounts? + get_membership_accounts
  end

  def full_name
    "#{first_name} #{last_name}"
  end

  def is_owner?(account)
    account.owner == self
  end

  def is_sysadmin?
    id == 1
  end

  def role(account)
    if is_sysadmin?
      'sysadmin'
    elsif is_owner?(account)
      'admin'
    else
      'user'
    end
  end

  def is_admin?(account)
    %w(sysadmin admin).include?(role(account))
  end

  # Remembers a user in the database for use in persistent sessions.
  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.digest(remember_token))
  end

  # Returns true if the given token matches the digest.
  def authenticated?(attribute, token)
    digest = send("#{attribute}_digest")
    return false if digest.nil?
    BCrypt::Password.new(digest).is_password?(token)
  end
  # def authenticated?(remember_token)
  #   return false if remember_digest.nil?
  #   BCrypt::Password.new(remember_digest).is_password?(remember_token)
  # end

  # Forgets a user.
  def forget
    update_attribute(:remember_digest, nil)
  end

  def owned_accounts
    Account.where(owner: self)
  end

  def all_accounts
    # Used to be: `owned_accounts + accounts`
    # but that would return an Array instead of a ActiveRecord relation and
    # arrays don't quite work with pagination.
    # Turns outs we needed to use this gem: https://github.com/brianhempel/active_record_union.
    # More on this here: https://stackoverflow.com/questions/6686920/activerecord-query-union
    # and here: https://github.com/brianhempel/active_record_union.
    # (see also this one: https://stackoverflow.com/questions/33683555/collectionproxy-vs-associationrelation)
    accounts.union(owned_accounts)
  end

  def get_total_properties
    properties.count
  end

  #######################
  #      Favorites      #
  #######################

  def favlist_create(name, account)
    favlists.create(name: name, account: account)
  end

  def favlist_destroy(name)
    favlists.where(name: name).destroy!
  end

  # TODO delete this
  # def favorite(property)
  #   favorites.find_or_create_by(property: property)
  # end

  def unfavorite(property)
    favorites.where(property: property).destroy_all
    property.reload
  end

  #######################

  # Sets the password reset attributes.
  def create_reset_digest
    self.reset_token = User.new_token
    update_attribute(:reset_digest,  User.digest(reset_token))
    update_attribute(:reset_sent_at, Time.zone.now)
  end

  # Sends password reset email.
  def send_password_reset_email(subdomain)
    UserMailer.password_reset(self, subdomain).deliver_now
  end

  # Returns true if a password reset has expired.
  def password_reset_expired?
    reset_sent_at < 2.hours.ago
  end

  # Checks whether users can reset their passwords based on the given domain
  def password_change_eligibility(subdomain)
    all_accounts.map(&:subdomain).include?(subdomain)
  end

  def self.sorted_by_assignments_count(dataset)
    dataset.sort_by(&:get_total_properties)
  end

  def age
    dob ? ((Time.zone.now - dob.to_time) / 1.year.seconds).floor : nil
  end


end
