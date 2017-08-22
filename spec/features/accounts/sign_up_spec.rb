require 'rails_helper'

feature 'Accounts' do
  scenario 'creating an account' do
    visit new_account_path
    # save_and_open_page
    fill_in 'Subdomain', with: 'demoportal'
    fill_in 'First name', with: 'demouser'
    fill_in 'Last name', with: 'demouser_last_name'
    fill_in 'Email', with: 'demouser@example.com'
    fill_in 'Password', with: 'abc123abc' , exact: true
    fill_in 'Password confirmation', with: 'abc123abc'
    click_button 'Create account'
    within('.alert-success') do
      success_message = 'Welcome to PropertyX! Your account has been successfully created.'
      expect(page).to have_content(success_message)
    end
    expect(page).to have_link('Signed is as demouser@example.com')
    expect(page.current_url).to eq('http://demoportal.lvh.me/')
  end

  scenario 'Ensure subdomain uniqueness' do
    Account.create!(subdomain: 'test')
    visit new_account_path
    fill_in 'Subdomain', with: 'test'
    fill_in 'First name', with: 'demouser'
    fill_in 'Last name', with: 'demouser_last_name'
    fill_in 'Email', with: 'demouser@example.com'
    fill_in 'Password', with: 'abc123abc' , exact: true
    fill_in 'Password confirmation', with: 'abc123abc'
    click_button 'Create account'
    expect(page.current_url).to eq('http://lvh.me/accounts')  # This caters for turbolinks bug https://github.com/turbolinks/turbolinks/issues/251
    expect(page).to have_content('Sorry, your account could not be created.') # General form error
    subdomain_error = find('.pr-inline-form-error').text # Specific inline form error
    expect(subdomain_error).to eq('Subdomain has already been taken.')
  end

end
