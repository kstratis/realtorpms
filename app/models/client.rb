class Client < ApplicationRecord
  belongs_to :account
  has_many :clientships
  has_many :users, -> {order('clientships.updated_at').select('users.*, clientships.updated_at as clientship_updated_at').distinct}, through: :clientships, dependent: :destroy
end
