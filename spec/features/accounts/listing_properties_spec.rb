require 'rails_helper'

feature 'Listing users', js: true do
  let(:account) { FactoryBot.create(:account) }

  context "as the account's owner" do
    before do
      # Capybara.app_host = 'http://lvh.me'
      # Capybara.always_include_port = true
      visit("http://lvh.me:#{Capybara.current_session.server.port}/login")
      # visit login_path
      fill_in 'Email', with: account.owner.email
      fill_in 'Password', with: account.owner.password
      click_button 'Log in'
    end

    it 'can list users' do
      expect(page.current_url).to eq("http://test1.lvh.me:#{Capybara.current_session.server.port}/")
      # After this line we can use all rails helpers
      set_subdomain(account.subdomain)
      visit users_path
      # There should be only one user here
      expect(page).to have_content('account.owner@example.com')
    end


  end
end
