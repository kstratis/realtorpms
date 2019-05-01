class Invitation < ActiveRecord::Base
  belongs_to :account
  accepts_nested_attributes_for :account
  # When creating an invite generate a token
  before_create :generate_token
  # If you resend the invite, re-generate the token
  before_update :generate_token
  # If all else fails this comes from stack overflow
  # before_validation :generate_token, on: :create
  validates :email, presence: true, length: { maximum: 50 }

  # We need to tell the Invitation model to use a token instead of an id as its parameter
  # The to_param method is what Rails calls to determine how to represent a resource as a parameter.
  # For example, accept_invitation_url(@invitation) would typically generate a path like /invitations/1/accept,
  # but with this override it’ll be something like /invitations/1d4537312d6f5220d5fc6e6740659653/accept.
  # The to_param method would default to the primary key of the table, but we can override it exactly as we’ve done
  # here to tell it to use something else; our token.
  def to_param
    token
  end

  private
    def generate_token
      self.token = SecureRandom.hex(16)
    end

end
