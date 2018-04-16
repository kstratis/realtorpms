require 'rails_helper'

describe 'Logging in the system without subdomain in url' do
  let(:account) { FactoryBot.create(:account, subdomain: 'test1') }
  let(:account2) { FactoryBot.create(:account2, subdomain: 'test2') }
  let(:account3) { FactoryBot.create(:account3, subdomain: 'test3') }
  let(:userExternal) { FactoryBot.create(:userExternal) }

  context 'as a user' do

    it 'who only owns an account' do
      visit 'http://lvh.me/login'
      fill_in 'Email', with: account.owner.email
      fill_in 'Password', with: account.owner.password
      click_button 'Log in'
      expect(page.current_url).to eq('http://test1.lvh.me/')
      expect(page).to have_content('This is the dashboard for logged in users')
    end

    it 'who owns an account but also is a member of another one' do
      account2.users << account.owner
      visit 'http://lvh.me/login'
      fill_in 'Email', with: account.owner.email
      fill_in 'Password', with: account.owner.password
      click_button 'Log in'
      expect(page.current_url).to eq('http://lvh.me/accounts')
      expect(page).to have_content('Account switch screen.')
    end

    it 'who is just a member of an account' do
      account2.users << userExternal
      visit 'http://lvh.me/login'
      fill_in 'Email', with: userExternal.email
      fill_in 'Password', with: 'abc123'
      click_button 'Log in'
      expect(page.current_url).to eq('http://test2.lvh.me/')
      expect(page).to have_content('This is the dashboard for logged in users')
    end

    it 'who is just a member of two or more accounts' do
      account.users << userExternal
      account2.users << userExternal
      visit 'http://lvh.me/login'
      fill_in 'Email', with: userExternal.email
      fill_in 'Password', with: 'abc123'
      click_button 'Log in'
      expect(page.current_url).to eq('http://lvh.me/accounts')
      expect(page).to have_content('Account switch screen.')
    end




  end
end
