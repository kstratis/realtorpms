require 'rails_helper'

feature 'Inviting users' do
  let(:account) { FactoryBot.create(:account) }
  before do
    set_subdomain(account.subdomain)
    visit 'http://lvh.me/login'
    fill_in 'Email', with: account.owner.email
    fill_in 'Password', with: account.owner.password
    click_button 'Log in'
    visit root_url
  end

  scenario 'invites a user successfully' do
    # click_link 'Invite User'
    # fill_in 'Email', with: 'test@example.com'
    # click_button 'Invite User'
    # expect(page).to have_content('test@example.com has been invited.')
    # expect(page.current_url).to eq(root_url)
    click_link 'ΣΥΝΕΡΓΑΤΕΣ'
    click_link 'invite-user-button'
    fill_in 'Email', with: 'test@example.com'
    click_button 'Invite User'
    expect(page).to have_content('test@example.com has been successfully invited.')
    expect(page.current_url).to eq(users_url)

    email = find_email('test@example.com')
    expect(email).to be_present
    expect(email.subject).to eq("Invitation to join the #{account.subdomain} domain on Landia")
  end end
