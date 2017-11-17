require 'rails_helper'

feature 'Listing resources', js: true do
  let(:account) { FactoryGirl.create(:account) }
  let(:account2) { FactoryGirl.create(:account2, subdomain: 'test2') }
  # This is 5 pages of users (10 on each) with a 6th one added for the owner
  let(:userList) { FactoryGirl.create_list(:usersequence, 50) }
  # the propertyList sequence will now continue from 50. i.e. 51, 52 etc.
  let(:propertyList) { FactoryGirl.create_list(:propertysequence, 50) }

  context "as the account's owner" do
    before do
      userList.map { |user| account.users << user}
      # This is necessary here to force initialization
      propertyList
      # Capybara.app_host = 'http://lvh.me'
      # Capybara.always_include_port = true
      visit("http://lvh.me:#{Capybara.current_session.server.port}/login")
      # visit login_path
      fill_in 'Email', with: account.owner.email
      fill_in 'Password', with: account.owner.password
      click_button 'Log in'
    end

    it 'can list account users' do
      expect(page.current_url).to eq("http://test1.lvh.me:#{Capybara.current_session.server.port}/")
      set_subdomain(account.subdomain)
      visit users_path
      find('li.page > a', text: '2', match: :prefer_exact).click
      # We use expect here so that enough time is given to the ajax request to complete
      expect(page).to have_css('li.page')
      find('li.page > a', text: '3', match: :prefer_exact).click
      expect(page).to have_css('li.page')
      find('li.page > a', text: '4', match: :prefer_exact).click
      expect(page).to have_css('li.page')
      find('li.page > a', text: '5', match: :prefer_exact).click
      expect(page).to have_content('user41@hotmail.com')
      find('li.page > a', text: '6', match: :prefer_exact).click
      expect(page).to have_content('account.owner@example.com')
    end

    it 'can list account properties' do
      expect(page.current_url).to eq("http://test1.lvh.me:#{Capybara.current_session.server.port}/")
      set_subdomain(account.subdomain)
      visit properties_path
      # puts page.current_url
      find('li.page > a', text: '2', match: :prefer_exact).click
      # we have to expect for somethong so that enough time is given to the ajax request to complete
      expect(page).to have_css('li.page')
      find('li.page > a', text: '3', match: :prefer_exact).click
      expect(page).to have_css('li.page')
      # save_and_open_page
      # find('li.page > a', text: '3', match: :prefer_exact).click
      # expect(page).to have_css('li.page')
      # find('li.page > a', text: '4', match: :prefer_exact).click
      # expect(page).to have_css('li.page')
      # find('li.page > a', text: '5', match: :prefer_exact).click
      # expect(page).to have_content('user41@hotmail.com')
      # find('li.page > a', text: '6', match: :prefer_exact).click
      # expect(page).to have_content('account.owner@example.com')
    end


  end
end
