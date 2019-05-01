require 'rails_helper'

describe 'Switching accounts' do
  let(:account) do
    FactoryBot.create(:account, subdomain: 'test1')
  end

  let(:account2) do
    FactoryBot.create(:account2, subdomain: 'test2')
  end

  before do
    account2.users << account.owner
    visit login_path
    fill_in 'Email', with: account.owner.email
    fill_in 'Password', with: 'abc123'
    click_button 'Log in'
    # save_and_open_page
    # login_as(account.owner)
  end

  it 'can switch between accounts' do
    set_subdomain(account.subdomain)
    visit root_url(subdomain: nil)

    click_link(BRANDNAME)
    expect(page.current_url).to eq(root_url(subdomain: nil))

    click_link 'test2'
    expect(page.current_url).to eq(root_url(subdomain: account2.subdomain))

    click_link(BRANDNAME)
    expect(page.current_url).to eq(root_url(subdomain: nil))

    click_link 'test1'
    expect(page.current_url).to eq(root_url(subdomain: account.subdomain))
  end
end
