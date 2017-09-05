require 'rails_helper'

describe 'Switching accounts' do
  let(:account) do
    FactoryGirl.create(:account, subdomain: 'test1')
  end

  let(:account2) do
    FactoryGirl.create(:account2, subdomain: 'test2')
  end

  before do
    account2.users << account.owner
    visit login_url
    fill_in 'Email', with: account.owner.email
    fill_in 'Password', with: 'abc123'
    click_button 'Log in'
    # login_as(account.owner)
  end

  it 'can switch between accounts' do
    set_subdomain(account.subdomain)
    visit root_url

    click_link 'Property X'
    expect(page.current_url).to eq(root_url(subdomain: nil))
    click_link 'Account #2'
    expect(page.current_url).to eq(root_url(subdomain: account2.subdomain))

    click_link 'Twist'
    expect(page.current_url).to eq(root_url(subdomain: nil))
    click_link 'Account #1'
    expect(page.current_url).to eq(root_url(subdomain: account.subdomain))
  end
end
