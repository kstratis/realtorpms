require 'rails_helper'

feature 'Logging in the system' do
  let(:account) { FactoryGirl.create(:account, subdomain: 'test1') }
  let(:account2) { FactoryGirl.create(:account2, subdomain: 'test2') }
  let(:account3) { FactoryGirl.create(:account3, subdomain: 'test3') }

  context 'without subdomain and without remember path' do

    it 'can log in' do
      visit 'http://lvh.me/login'
      save_and_open_page
      fill_in 'session_email', with: account.owner.email
      fill_in 'session_password', with: account.owner.password
      click_button 'Είσοδος'
      expect(page.current_url).to eq('http://test1.lvh.me/')
    end

    it 'cannot log in with wrong password' do
      visit 'http://lvh.me/login'
      fill_in 'Email', with: account.owner.email
      fill_in 'Password', with: 'password'
      click_button 'Log in'
      expect(page.current_url).to eq('http://lvh.me/login')
    end

    it 'cannot log in with wrong email' do
      visit 'http://lvh.me/login'
      fill_in 'Email', with: 'myemail@gmail.com'
      fill_in 'Password', with: account.owner.password
      click_button 'Log in'
      expect(page.current_url).to eq('http://lvh.me/login')
    end

    it 'cannot log in with wrong username and password' do
      visit 'http://lvh.me/login'
      fill_in 'Email', with: 'myemail@gmail.com'
      fill_in 'Password', with: 'mypassword'
      click_button 'Log in'
      expect(page.current_url).to eq('http://lvh.me/login')
    end
  end

  context 'with subdomain and no remember path' do
    it 'can log in' do
      visit 'http://test1.lvh.me'
      fill_in 'Email', with: account.owner.email
      fill_in 'Password', with: account.owner.password
      click_button 'Log in'
      expect(page.current_url).to eq('http://test1.lvh.me/')
    end

    it 'cannot log in with wrong password' do
      visit 'http://test1.lvh.me'
      fill_in 'Email', with: account.owner.email
      fill_in 'Password', with: 'password'
      click_button 'Log in'
      expect(page.current_url).to eq('http://lvh.me/login')
    end

    it 'cannot log in with wrong email' do
      visit 'http://test1.lvh.me'
      fill_in 'Email', with: 'myemail@gmail.com'
      fill_in 'Password', with: account.owner.password
      click_button 'Log in'
      expect(page.current_url).to eq('http://lvh.me/login')
    end

    it 'cannot log in with wrong username and password' do
      visit 'http://test1.lvh.me'
      fill_in 'Email', with: 'myemail@gmail.com'
      fill_in 'Password', with: 'mypassword'
      click_button 'Log in'
      expect(page.current_url).to eq('http://lvh.me/login')
    end

  end

  context 'with subdomain and remember path' do

    before do
      set_subdomain(account.subdomain)
    end

    it 'can log in' do
      visit users_url
      fill_in 'Email', with: account.owner.email
      fill_in 'Password', with: 'abc123'
      click_button 'Log in'
      expect(page.current_url).to eq(users_url)
    end

    it 'should not be redirected to dashboard' do
      visit users_url
      fill_in 'Email', with: account.owner.email
      fill_in 'Password', with: 'abc123'
      click_button 'Log in'
      expect(page.current_url).not_to eq(root_url)
    end

    it 'cannot log in with wrong password' do
      visit login_url
      fill_in 'Email', with: account.owner.email
      fill_in 'Password', with: 'password'
      click_button 'Log in'
      expect(page.current_url).to eq(login_url)
    end

    it 'cannot log in with wrong email' do
      visit login_url
      fill_in 'Email', with: 'myemail@gmail.com'
      fill_in 'Password', with: account.owner.password
      click_button 'Log in'
      expect(page.current_url).to eq(login_url)
    end

    it 'cannot log in with wrong username and password' do
      visit login_url
      fill_in 'Email', with: 'myemail@gmail.com'
      fill_in 'Password', with: 'mypassword'
      click_button 'Log in'
      expect(page.current_url).to eq(login_url)
    end

  end

  context 'without subdomain just remember path' do
    it 'of /users will cause routing error because all routes are contraint protected' do
      expect{ visit 'http://lvh.me/users' }.to raise_error(ActionController::RoutingError)
    end

    it 'of /properties will cause routing error because all routes are contraint protected' do
      expect{ visit 'http://lvh.me/properties' }.to raise_error(ActionController::RoutingError)
    end

    it 'of /properties will cause routing error because all routes are contraint protected' do
      expect{ visit 'http://lvh.me/properties/new' }.to raise_error(ActionController::RoutingError)
    end
  end

end
