class Invitation < ApplicationRecord
  belongs_to :account
  validates :email, presence: true, length: { maximum: 50 }
end
