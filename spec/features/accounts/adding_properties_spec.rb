require 'rails_helper'

feature 'Adding properties' do
  let(:account) { FactoryBot.create(:account) }

  context "as the account's owner" do
    before do
      visit 'http://lvh.me/login'
      fill_in 'Email', with: account.owner.email
      fill_in 'Password', with: account.owner.password
      click_button 'Log in'
    end

    it 'can add a new property' do
      # set_subdomain(account.subdomain)
      expect(page.current_url).to eq('http://test1.lvh.me/')
      # Alternatively use this:
      # visit new_property_path
      # save_and_open_page
      click_link 'ΑΚΙΝΗΤΑ'
      click_link 'New Property'
      fill_in 'Description', with: 'mezoneta sti kifisia'
      fill_in 'Price', with: '500000'
      fill_in 'Size', with: '150'
      click_button 'Add new property'
      expect(page).to have_content('Property successfully created.')
    end
  end
end
