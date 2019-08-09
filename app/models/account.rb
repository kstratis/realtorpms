class Account < ApplicationRecord
  belongs_to :owner, class_name: 'User'
  accepts_nested_attributes_for :owner
  validates :subdomain, presence: true, length: { maximum: 20 }, uniqueness: true
  validates :name, presence: true, length: { maximum: 20 }, uniqueness: true

  has_many :invitations, dependent: :destroy # Only destroys invitations associated with the current account
  has_many :properties, dependent: :destroy # Only destroys properties associated with the current account
  has_many :landlords, dependent: :destroy # Only destroys landlords associated with the current account
  # Favlists have 2 foreign keys: 1 to table Users and 1 to table Accounts. Deleting a User will drop all its
  # favlists in all of his accounts. Deleting an account will delete all the favlists belonging to current account
  # of all users.
  has_many :favlists, dependent: :destroy # Only destroys favlists associated with the current account

  has_many :memberships
  has_many :users, through: :memberships, dependent: :destroy
  validates_associated :owner

  # Returns all account users including the owner of the account
  # Uses the active_record_union gem
  def all_users
    # Used to be:
    # users.joins(:accounts).where(accounts: {owner_id: user.id})
    users.union(User.where(id: owner.id))
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
end
