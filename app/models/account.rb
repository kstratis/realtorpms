class Account < ApplicationRecord
  belongs_to :owner, class_name: 'User'
  accepts_nested_attributes_for :owner
  validates :subdomain, presence: true, length: { maximum: 20 }, uniqueness: true

  has_many :invitations, dependent: :destroy
  has_many :properties, dependent: :destroy
  # Originally had these 2 lines
  has_many :memberships
  has_many :users, through: :memberships, dependent: :destroy
  validates_associated :owner

  # Returns all account users including the owner of the account
  def all_users(user)
    # Used to be:
    # users.joins(:accounts).where(accounts: {owner_id: user.id})
    users.merge(User.where(id: user.id))
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
