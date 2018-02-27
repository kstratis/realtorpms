require 'rails_helper'

RSpec.describe Invitation, type: :model do
  it 'generates a unique token' do
    invitation = Invitation.create(
        email: 'villa86@yahoo.com',
        account_attributes: {
            subdomain: 'yokochoko'
        }
    )
    expect(invitation.token).to be_present
  end
end