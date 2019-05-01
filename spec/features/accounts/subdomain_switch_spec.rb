require 'rails_helper'

# This spec is about the scenario where a user successfully logs in and consequently tries
# to access different subdomains by using the browser's address bar.
describe 'Switch subdomains with one' do

  let(:account) { FactoryBot.create(:account, subdomain: 'test1') }
  let(:account2) { FactoryBot.create(:account2, subdomain: 'test2') }
  let(:account3) { FactoryBot.create(:account3, subdomain: 'test3') }

  before do
    set_subdomain(account.subdomain)
    visit login_path
    fill_in 'Email', with: account.owner.email
    fill_in 'Password', with: 'abc123'
    click_button 'Log in'
  end

  it 'that the user doesn\'t belong to' do
    expect(page.current_url).to eq(root_url)
    visit root_url(subdomain: account2.subdomain)
    expect(page).to have_content('Unauthorized domain.')
  end

  it 'that the user belongs to' do
    account2.users << account.owner
    expect(page.current_url).to eq(root_url)
    visit root_url(subdomain: account2.subdomain)
    expect(page).to have_content("You switched to the #{account2.subdomain} organization")
  end

  it 'that doesn\'t exist' do
    expect(page.current_url).to eq(root_url)
    visit root_url(subdomain: 'sdfhksdjfhskdjfhkd')
    expect(page).to have_content('You may have mistyped the address')
  end



end