class Client < ApplicationRecord
  include Searchable

  attr_searchable %w(first_name last_name email)

  belongs_to :account
  has_many :clientships
  has_many :users, -> {order('clientships.updated_at').select('users.*, clientships.updated_at as clientship_updated_at').distinct}, through: :clientships, dependent: :destroy
  has_many :logs, dependent: :nullify
  # CPA stands for Client-Property-Association (many-to-many join table)
  has_many :cpas
  has_many :properties, -> { distinct }, through: :cpas

  before_create { self.color = COLOR_PALETTE.sample } # This assigns a random bg color to each new user

  # This is for existing log records
  # https://stackoverflow.com/a/9326882/178728
  # before_destroy { |record| Log.where(client: record).update_all(client_name: record.full_name) }

  validates :first_name, presence: true, length: { maximum: 50 }
  validates :last_name, presence: true, length: { maximum: 50 }

  def full_name
    "#{first_name} #{last_name}"
  end
end
