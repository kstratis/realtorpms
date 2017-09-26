class User < ApplicationRecord
  self.per_page = 10 # This is for pagination
  attr_accessor :remember_token
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i  # checks the email format
  before_save { self.email = email.downcase }  # makes sure everything is lower case
  validates :first_name, presence: true, length: { maximum: 50 }
  validates :last_name, presence: true, length: { maximum: 50 }
  validates :email, presence: true, length: { maximum: 255 },
            format: { with: VALID_EMAIL_REGEX },
            uniqueness: { case_sensitive: false }
  has_secure_password
  validates :password, presence: true, length: { minimum: 6 }, allow_nil: true

  # belongs_to :account, optional: true
  # belongs_to :account
  # has_one :account

  # Later on...
  has_many :memberships
  has_many :accounts, through: :memberships

  # Much later on...
  has_many :assignments
  has_many :properties, through: :assignments
  # has_many :properties, -> (account) { where('account_id = ?', account.id) }, through: :assignments


           # Basically class methods defined on singleton class
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

  # Remembers a user in the database for use in persistent sessions.
  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.digest(remember_token))
  end

  # Returns true if the given token matches the digest.
  def authenticated?(remember_token)
    return false if remember_digest.nil?
    BCrypt::Password.new(remember_digest).is_password?(remember_token)
  end

  # Forgets a user.
  def forget
    update_attribute(:remember_digest, nil)
  end

  def owned_accounts
    Account.where(owner: self)
  end

  def all_accounts
    owned_accounts + accounts
  end

  def self.search(search)
    if search
      where('last_name LIKE ?', "%#{search}%")
    end
  end

end
