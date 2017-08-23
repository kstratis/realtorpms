require 'rails_helper'

feature 'Adding books' do
  let(:account) { FactoryGirl.create(:account) }

  context "as the account's owner" do
    before do
      visit 'http://lvh.me/login'
      fill_in 'Email', with: account.owner.email
      fill_in 'Password', with: account.owner.password
      click_button 'Log in'
    end

    it 'can add a property' do
      visit new_property_path
      # click_link 'Add new property'
      fill_in 'Description', with: 'mezoneta sti kifisia'
      fill_in 'Price', with: '500000'
      fill_in 'Size', with: '150'
      click_button 'Add new property'
      expect(page).to have_content('Property successfully created.')
    end
  end
end
