module Accounts
  class BaseController < ApplicationController
    before_action :logged_in_user, only: [:index, :edit, :update, :destroy]
    before_action :correct_subdomain

    def current_account
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

    def correct_subdomain
      subdomain = get_subdomain(current_user)
      unless request.subdomain == subdomain
        render_404
      end
    end

  end
end