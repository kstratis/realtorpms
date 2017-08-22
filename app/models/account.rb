class Account < ApplicationRecord
  validates :subdomain, presence: true, length: { maximum: 50 }, uniqueness: true
  belongs_to :owner, class_name: 'User', optional: true
  accepts_nested_attributes_for :owner

  class << self
    # Returns the registered subdomain
    def get_subdomain(user)
      self.find_by(owner_id: user.id).subdomain
    end

    def subdomain_exists?(requested_subdomain)
      subdomain = self.find_by(subdomain: requested_subdomain)
      # puts res
      return true if subdomain else false
    end
  end
end
