class Account < ApplicationRecord
  belongs_to :owner, class_name: 'User'
  accepts_nested_attributes_for :owner
  validates :subdomain,
            presence: true,
            length: { minimum: 3, maximum: 20 },
            uniqueness: true,
            format: /\A[a-zA-Z0-9]*\z/

  validates :name, presence: true, length: { maximum: 20 }, uniqueness: true
  # This is intentionally commented out since accounts can't be created on signup without description.
  # We only do js validation on this on the edit screen
  # validates :description, presence: true

  has_many :invitations, dependent: :destroy # Only destroys invitations associated with the current account
  has_many :properties, dependent: :destroy # Only destroys properties associated with the current account
  has_many :clients, dependent: :destroy # Only destroys clients associated with the current account
  has_many :cpas, dependent: :destroy # Only destroys cpas associated with the current account
  # Favlists have 2 foreign keys: 1 to table Users and 1 to table Accounts. Deleting a User will drop all its
  # favlists in all of his accounts. Deleting an account will delete all the favlists belonging to current account
  # of all users.
  has_many :favlists, dependent: :destroy # Only destroys favlists associated with the current account

  has_many :memberships
  has_many :users, through: :memberships, dependent: :destroy
  has_many :logs, dependent: :nullify
  # Each account auto generates 3 model types one for each of users, properties & clients
  # Properties and clients are scoped to account and linked to each model through a regular foreign key.
  # However users may belong to multiple accounts and each account can have its own model fields. Thus for
  # users we use a HABTM association.
  has_many :model_types, dependent: :destroy

  has_one_attached :avatar

  validates_associated :owner

  before_create :confirmation_token
  after_create :build_custom_fields

  before_validation do
    self.subdomain = self.subdomain.downcase unless subdomain.blank?
  end

  # This is for existing log records
  # https://stackoverflow.com/a/9326882/178728
  # before_destroy { |record| Log.where(account: record).update_all(account_name: record.subdomain) }

  # Returns all account users including the owner of the account
  # Uses the active_record_union gem
  def all_users
    # Used to be:
    # users.joins(:accounts).where(accounts: {owner_id: user.id})
    users.union(User.where(id: owner.id))
  end

  def all_users_plus_sys
    # Used to be:
    # users.joins(:accounts).where(accounts: {owner_id: user.id})
    users.union(User.where(id: [owner.id, 1]))
  end

  class << self

    # Returns the registered subdomain
    def get_subdomain(user)
      # unless current_account.owner == current_user ||
      #     current_account.users.exists?(current_user.id)
      # This will only work if the user is also the account owner
      self.find_by(owner_id: user.id).subdomain
    end

    def subdomain_exists?(requested_subdomain)
      subdomain = self.find_by(subdomain: requested_subdomain)
      !!subdomain
    end
  end

  # self is explicitly used here to indicate the newly created object
  def build_custom_fields
    %w(users properties clients).each do |el|
      self.model_types.create(name: el.to_s)
    end
  end

  def email_activate
    self.email_confirmed = true
    self.confirm_token = nil
    save!(:validate => false)
  end

  private

  def confirmation_token
    return unless self.confirm_token.blank?

    self.confirm_token = SecureRandom.urlsafe_base64.to_s
  end
end
