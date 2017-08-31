class Invitation < ActiveRecord::Base
  belongs_to :account, optional: true
  before_create :generate_token
  # before_validation :generate_token, on: :create
  validates :email, presence: true, length: { maximum: 50 }

  private
    def generate_token
      self.token = SecureRandom.hex(16)
    end

end
