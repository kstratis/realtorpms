class Client < ApplicationRecord
  include Searchable

  attr_searchable %w(first_name last_name email)

  belongs_to :account
  has_many :clientships
  has_many :users, -> {order('clientships.updated_at').select('users.*, clientships.updated_at as clientship_updated_at').distinct}, through: :clientships, dependent: :destroy

  validates :first_name, presence: true, length: { maximum: 50 }
  validates :last_name, presence: true, length: { maximum: 50 }

  def full_name
    "#{first_name} #{last_name}"
  end
end
