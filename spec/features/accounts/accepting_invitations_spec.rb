require 'rails_helper'

feature 'Accepting invitations' do
  let(:account) { FactoryBot.create(:account) }
  let(:invitation) do
    Invitation.create(account: account, email: 'test@example.com')
  end

  before do
    InvitationMailer.invite(invitation).deliver_now
    set_subdomain(account.subdomain)
  end

  scenario 'accepts an invitation' do
    # expect(account.users.count).to eq(1)
    # puts account.users.count

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
    expect(page).to have_content("You have successfully joined the #{account.subdomain} organization.")
    expect(page.current_url).to eq(root_url(subdomain: account.subdomain))
    # After the invited user joins our subdomain the domain user count should be 1
    # puts "accounts before: #{account.users.count}"
    # account.users << account.owner
    # Since I can't add the owner to domain users in factory girl I do it here manually and then verify
    # puts "accounts after: #{account.users.count}"
    # expect(account.users.count).to eq(2)
  end

  scenario 'accepts an invitation as an existing user' do
    email = open_email('test@example.com')
    accept_link = links_in_email(email).first
    expect(accept_link).to be_present

    visit accept_link
    click_link 'Sign in as an existing user'

    user2 = FactoryBot.create(:user2)
    fill_in 'Email', with: user2.email
    fill_in 'Password', with: 'abc123'
    click_button 'Log in'


    # invitation_url = accept_invitation_url(invitation, subdomain: account.subdomain)
    # set subdomain to false to counter the +set_subdomain+ in the before hook
    invitation_url = accept_invitation_url(invitation, subdomain: false)
    expect(page.current_url).to eq(invitation_url)
    expect(page).to_not have_content('Sign in as an existing user')
    click_button 'Accept Invitation'

    expect(page).to have_content("You have successfully joined the #{account.subdomain} organization.")
    expect(page.current_url).to eq(root_url)
  end

end
