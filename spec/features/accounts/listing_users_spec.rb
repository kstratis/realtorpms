require 'rails_helper'

feature 'Adding properties' do
  let(:account) { FactoryGirl.create(:account) }

  context "as the account's owner" do
    before do
      visit 'http://lvh.me/login'
      fill_in 'Email', with: account.owner.email
      fill_in 'Password', with: account.owner.password
      click_button 'Log in'
    end

    it 'can list users' do
      expect(page.current_url).to eq('http://test1.lvh.me/')
      # user-2@starwars.com
      # Alternatively use this:
      set_subdomain(account.subdomain)
      visit users_path
      # visit 'http://lvh.me/users'
      save_and_open_page
      # click_link 'ΑΚΙΝΗΤΑ'
      # click_link 'New Property'
      # fill_in 'Description', with: 'mezoneta sti kifisia'
      # fill_in 'Price', with: '500000'
      # fill_in 'Size', with: '150'
      # click_button 'Add new property'
      # save_and_open_page
      expect(page).to have_content('user-2@starwars.com')

      # expect(page).to have_content('Property successfully created.')
    end
  end
end
