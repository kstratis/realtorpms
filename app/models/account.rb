class Account < ApplicationRecord
  validates :subdomain, presence: true, length: { maximum: 50 }, uniqueness: true

  accepts_nested_attributes_for :owner

  has_many :invitations

  has_many :memberships

  has_many :users, through: :memberships
  # experiment
  # has_many :users

  belongs_to :owner, class_name: 'User', optional: true

  # These basically are class methods
  class << self
    # Returns the registered subdomain
    def get_subdomain(user)
      puts "user in Account is: #{user.first_name}"
      # This will only work if the user is also the account owner
      self.find_by(owner_id: user.id).subdomain
    end

    def subdomain_exists?(requested_subdomain)
      subdomain = self.find_by(subdomain: requested_subdomain)
      return true if subdomain else false
    end
  end
end
