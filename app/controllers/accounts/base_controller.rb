module Accounts
  class BaseController < ApplicationController
    before_action :logged_in_user, only: [:index, :edit, :update, :destroy]

    # before_action :correct_subdomain

    # this is only called from the template properties#index
    def current_account
      # this results in 404 in production
      @current_account ||= Account.find_by!(subdomain: request.subdomain)
    end

    helper_method :current_account

    def owner?
      current_account.owner == current_user
    end

    helper_method :owner?

    def logged_in_user
      unless logged_in?
        store_location
        redirect_to login_url
      end
    end

    # This method ensures that the correct subdomain is used between requests
    # once the user logs in. Not used yet.
    def ensure_correct_subdomain
      # puts 'correct subdomain called'
      # puts caller[0][/`.*'/][1..-2]
      # puts "current user is: #{current_user.first_name}"
      # puts "current account owner is: #{User.find(current_account.owner_id).first_name}"
      if current_account.owner_id == current_user.id
        subdomain = get_subdomain(current_user)
      else
        puts 'inside else'
        subdomain = current_user.account.subdomain
        # subdomain = current_account.subdomain
      end

      # puts "subdomain is: #{subdomain}"
      unless request.subdomain == subdomain
        puts 'LALALA'
        render_404
      end
    end



  end
end