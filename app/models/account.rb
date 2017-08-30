class Account < ApplicationRecord
  validates :subdomain, presence: true, length: { maximum: 50 }, uniqueness: true

  has_many :invitations

  # Originally had these 2 lines
  # has_many :memberships
  # has_many :users, through: :memberships

  # which I replaced with this line
  has_many :users

  # belongs_to :owner, class_name: 'User', optional: true
  belongs_to :owner, class_name: 'User'

  accepts_nested_attributes_for :owner

  # These basically are class methods
  class << self
    # Returns the registered subdomain
    def get_subdomain(user)
      # This will only work if the user is also the account owner
      self.find_by(owner_id: user.id).subdomain
    end

    def subdomain_exists?(requested_subdomain)
      subdomain = self.find_by(subdomain: requested_subdomain)
      return true if subdomain else false
    end
  end
end
