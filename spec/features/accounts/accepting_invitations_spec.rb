require 'rails_helper'

feature 'Accepting invitations' do
  let(:account) { FactoryGirl.create(:account) }
  let(:invitation) do
    Invitation.create(account: account, email: 'test@example.com')
  end

  before do
    InvitationMailer.invite(invitation).deliver_now
    set_subdomain(account.subdomain)
  end

  scenario 'accepts an invitation' do
    email = open_email('test@example.com')
    # puts email
    accept_link = links_in_email(email).first
    expect(accept_link).to be_present
    visit accept_link
    # save_and_open_page
    fill_in 'First name', with: 'demouser_first_name'
    fill_in 'Last name', with: 'demouser_last_name'
    fill_in 'Password', with: 'password'
    fill_in 'Password confirmation', with: 'password'
    click_button 'Accept Invitation'
    expect(page).to have_content("You have joined the #{account.subdomain} account.")
    expect(page.current_url).to eq(root_url(subdomain: account.subdomain))
  end
end
