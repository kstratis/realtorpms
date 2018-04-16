require 'rails_helper'

feature 'Account permissions' do
  let(:account) { FactoryBot.create(:account) }
  before do
    set_subdomain(account.subdomain)
  end

  scenario 'cannot access the account if not owner or a user' do
    visit root_url
    sign_in_message = 'Log in'
    expect(page).to have_content(sign_in_message)
  end

  context 'the account\'s owner' do
    let(:user) { account.owner }
    before do
      visit login_url
      fill_in 'Email', with: user.email
      fill_in 'Password', with: 'abc123'
      click_button 'Log in'

    end
    scenario 'can see the account' do
      visit root_url
      expect(page.current_url).to eq(root_url)
    end
  end

  context 'a user of the account' do
    # user2 = FactoryBot.create(:user2)
    let(:user2) { FactoryBot.create(:user2) }
    before do
      account.users << user2
      # save_and_open_page
      visit login_url
      fill_in 'Email', with: user2.email
      fill_in 'Password', with: 'abc123'
      click_button 'Log in'
    end

    scenario 'can see the account' do
      visit root_url
      # puts root_url
      expect(page.current_url).to eq(root_url)
    end
  end

  context 'an unauthorized user' do
    let(:user3) { FactoryBot.create(:user3) }
    before do
      visit login_url
      fill_in 'Email', with: user3.email
      fill_in 'Password', with: 'abc123'
      click_button 'Log in'
    end

    scenario 'is not permitted to access the account' do
      expect(page).to have_content('Unauthorized domain')
      expect(page.current_url).to eq(login_url(subdomain: account.subdomain))
    end
  end
end
