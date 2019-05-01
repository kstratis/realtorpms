require 'rails_helper'

# This tests for sorting via the calculated
# assigned properties field

feature 'Listing resources', js: true do
  let(:account) { FactoryBot.create(:account) }
  # This is 5 regular users plus the account owner
  let(:userList) { FactoryBot.create_list(:usersequence, 5) }
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
      user1 = account.users.find_by(email: 'user1@hotmail.com')
      user2 = account.users.find_by(email: 'user2@hotmail.com')
      user3 = account.users.find_by(email: 'user3@hotmail.com')
      propertyList[0..20].map { |property | user3.properties << property }
      propertyList[20..30].map { |property | user2.properties << property }
      propertyList[30..35].map { |property | user1.properties << property }
      # Capybara.app_host = 'http://lvh.me'
      # Capybara.always_include_port = true
      visit("http://lvh.me:#{Capybara.current_session.server.port}/login")
      # visit login_path
      fill_in 'Email', with: account.owner.email
      fill_in 'Password', with: account.owner.password
      click_button 'Log in'
    end

    it 'can properly use the email sorting filter on account users listings' do
      expect(page.current_url).to eq("http://test1.lvh.me:#{Capybara.current_session.server.port}/")
      set_subdomain(account.subdomain)
      # It doesn't matter which property we visit since the user table
      # will now include the assignment count
      visit property_path(5)
      click_link('sort_by_assignments') # ascending order
      expect(page).to have_css('li.page')
      click_link('sort_by_assignments') # descending order

      # We know beforehand that this user is user3@hotmail.com and that he has
      # been assigned a total of 21 properties including the property with id 5.
      # Confirm it's this user
      # td:nth-of-type(5) is the email column of the first entry
      within('tbody tr:first-of-type td:nth-of-type(2) > div.table-entry > span'  ) {
        expect(page).to have_text('user3@hotmail.com')
      }
      # Confirm his/her property count
      # td:nth-of-type(5) is the assignments column of the first entry
      within('tbody tr:first-of-type td:nth-of-type(5) > div.table-entry > span'  ) {
        expect(page).to have_text('21')
      }
      # Do the same for the user 'below him'
      # td:nth-of-type(5) is the email column of the first entry
      within('tbody tr:nth-of-type(2) td:nth-of-type(2) > div.table-entry > span'  ) {
        expect(page).to have_text('user2@hotmail.com')
      }
      # td:nth-of-type(5) is the assignments column of the first entry
      within('tbody tr:nth-of-type(2) td:nth-of-type(5) > div.table-entry > span'  ) {
        expect(page).to have_text('11')
      }

      # Press the button next to the first user.
      # Since we know that property 5 is already assigned the text should read 'UNASSIGN'.
      # However due to i18n this will change and thus we use the data attributes to get such info
      button_method = find('#usersTable > tbody > tr:nth-child(1) > td:nth-child(6) > div > div > a.assign-toggle')[:'data-methodtype']
      find('#usersTable > tbody > tr:nth-child(1) > td:nth-child(6) > div > div > a.assign-toggle').click

      # According to whether this user has already been assigned property 5, expect his/her
      # total count to change accordingly after the click.
      if button_method == 'delete'
        within('#usersTable > tbody > tr:nth-child(1) > td:nth-child(5) > div > span') {
          expect(page).to have_text('20')
        }
      else
        within('#usersTable > tbody > tr:nth-child(1) > td:nth-child(5) > div > span') {
          expect(page).to have_text('22')
        }
      end

    end
  end
end
