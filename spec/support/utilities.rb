require 'rails_helper'

module Utilities
  def sign_in_without_subdomain(user)
    # user = create(:user)
    visit 'http://lvh.me/login'
    fill_in 'Email', with: user.email
    fill_in 'Password', with: user.password
    click_button 'Log in'
  end

  def sign_in_existing_subdomain(user)
    # user = create(:user)
    visit 'http://test1.lvh.me/'
    fill_in 'Email', with: user.email
    fill_in 'Password', with: user.password
    click_button 'Log in'
  end


  def actually_log_in_as(user)
    visit root_path
    click_link "Sign in"
    fill_in "Email", :with => user.email
    fill_in "Password", :with => "password" # test password
    click_button "Log in"
    # request.session[:user_id] = user.id
  end

  # Sign in helper method - request specs
  # https://github.com/rails/rails/issues/23386#issuecomment-192954569
  # https://stackoverflow.com/questions/5787409/stubbing-authentication-in-request-spec
  def sign_in_as(user, subdomain)
    post "http://#{subdomain}.lvh.me/login", params: { session: { email: user.email, password: user.password} }
  end
end


# Include this helper in tests
RSpec.configure do |config|
  config.include Utilities
end

# RSpec.configure do |c|
#   c.include Utilities, type: :feature
#
#   c.before type: :feature do
#     Capybara.app_host = "http://lvh.me"
#   end
# end