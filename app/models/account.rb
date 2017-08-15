class Account < ApplicationRecord
  validates :subdomain, presence: true, length: { maximum: 50 }, uniqueness: true
  belongs_to :owner, class_name: 'User', optional: true
  accepts_nested_attributes_for :owner
end
