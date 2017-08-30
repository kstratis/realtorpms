require 'rails_helper'

feature 'Accounts subdomain redirection' do

  scenario 'Getting the login screen with erroneous subdomain should redirect user to main login' do
    visit 'http://sdadasasdasd.lvh.me/login'
    expect(page.current_url).to eq('http://lvh.me/login')
  end

  scenario 'Getting the login screen with erroneous subdomain and proper remember path should redirect user to main login' do
    visit 'http://sdadasasdasd.lvh.me/users'
    expect(page.current_url).to eq('http://lvh.me/login')
  end

  scenario 'Getting the login screen with proper subdomain allows for subdomain-scoped logging in' do
    Account.create!(
      subdomain: 'exampledomain',
      owner_attributes:{
          email: 'fd@gmail.com',
          first_name: 'Freddie',
          last_name: 'Mercury',
          password: 'abc123',
          password_confirmation: 'abc123',
          account_id: self
      }
    )
    visit 'http://exampledomain.lvh.me/login'
    expect(page.current_url).to eq('http://exampledomain.lvh.me/login')
  end

  scenario 'Getting the login screen with proper subdomain and remember path' do
    Account.create!(
        subdomain: 'exampledomain',
        owner_attributes:{
            email: 'fd@gmail.com',
            first_name: 'Freddie',
            last_name: 'Mercury',
            password: 'abc123',
            password_confirmation: 'abc123',
            account_id: self
        }
    )
    visit 'http://exampledomain.lvh.me/users'
    expect(page.current_url).to eq('http://exampledomain.lvh.me/login')
  end

end