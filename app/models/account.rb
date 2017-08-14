class Account < ApplicationRecord
  validates :subdomain, presence: true, length: { maximum: 50 }
  belongs_to :owner, class_name: 'User'
  accepts_nested_attributes_for :owner

end
