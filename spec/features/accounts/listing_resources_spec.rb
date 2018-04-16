require 'rails_helper'

# This test only test for listing and pagination of users and properties
# and also tests the users sort by email filtering option. Registration
# and name remain untested as it would require a very specific dataset
# with a very specific timing to test against them.

feature 'Listing resources', js: true do
  let(:account) { FactoryBot.create(:account) }
  let(:account2) { FactoryBot.create(:account2, subdomain: 'test2') }
  # This is 5 pages of users (10 on each) with a 6th one added for the owner
  let(:userList) { FactoryBot.create_list(:usersequence, 50) }
  # the propertyList sequence will  continue in parallel even if not user.
  # This means that for the first +it+ 0-50 property ids will be given. In the
  # third +it+ where we actually need the property list the ids range will have reached
  # the 100-150.
  let(:propertyList) { FactoryBot.create_list(:propertysequence, 50) }

  # This before block runs before each and every +it+ therefore if we have say 3 +it+
  # tests the user id will reach 150 (thanks to +userList.map { |user| account.users << user}+)
  # and the same goes for the property id (thanks to +propertyList+). Assuming the value of
  # n persists among +it+ tests
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

    # 0-50 list range ids
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

    # 50-100 list range ids
    it 'can properly use the email sorting filter on account users listings' do
      expect(page.current_url).to eq("http://test1.lvh.me:#{Capybara.current_session.server.port}/")
      set_subdomain(account.subdomain)
      visit users_path
      # Test sorting by email -ascending order
      click_link('sort_by_email')
      expect(page).to have_css('li.page')
      # td:nth-of-type(5) is the email column
      within('tbody tr:first-of-type td:nth-of-type(2) > div.table-entry > span'  ) {
        # puts page.text prints all text within the selectors scope.
        expect(page).to have_text('account.owner@example.com')
      }
      # Test sorting by email -descending order
      click_link('sort_by_email')
      expect(page).to have_css('li.page')
      within('tbody tr:first-of-type td:nth-of-type(2) > div.table-entry > span'  ) {
        # puts page.text prints all text within the selectors scope.
        expect(page).to have_text('user99@hotmail.com')
        expect(page).not_to have_text('account.owner@example.com')
      }
    end

    # 100-150 list range ids
    it 'can list account properties' do
      expect(page.current_url).to eq("http://test1.lvh.me:#{Capybara.current_session.server.port}/")
      set_subdomain(account.subdomain)
      visit properties_path
      find('li.page > a', text: '2', match: :prefer_exact).click
      # we have to expect for somethong so that enough time is given to the ajax request to complete
      expect(page).to have_css('li.page')
      find('li.page > a', text: '3', match: :prefer_exact).click
      expect(page).to have_css('li.page')
    end
  end
end
