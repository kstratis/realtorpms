module Accounts
  class BaseController < ApplicationController
    include UserDatatable
    include LocationFilter
    include OwnerFilter

    # before_action :authenticate_user!, :allowed_subdomains, only: [:index, :edit, :update, :destroy]
    # before_action :authenticate_user!, :allowed_subdomains
    # before_action :authenticate_user!
    before_action :authenticate_user!, except: [:receive]
    after_action :store_referer_url, only: [:index, :edit, :update, :destroy]

    # before_action :correct_subdomain

    def check_page_validity
      if params[:page]
        param = Integer(params[:page]) rescue nil
        unless param.is_a? Integer
          render_404 and return
        end
      end
    end

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
      puts 'RUNNING'
      unless logged_in?
        store_location
        redirect_to login_url
      end
    end

    def store_referer_url
      session[:referer_url] = request.original_url if request.get?
    end

    def allowed_subdomains
      subdomain_list = []
      accounts = current_user.is_admin? ? Account.all : current_user.all_accounts
      accounts.each do |account|
        subdomain_list << account.subdomain
      end
      unless session[:referer_url].blank?
        previous_subdomain = URI.parse(session[:referer_url]).host.split('.')[0..-3].join('.')
        unless previous_subdomain == request.subdomain
          Account.find_by!(subdomain: request.subdomain)
          if subdomain_list.include? request.subdomain
            flash.now[:success] = "You switched to the #{request.subdomain} organization"
          else
            render_401 and return
          end
        end
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
        subdomain = current_user.account.subdomain
        # subdomain = current_account.subdomain
      end

      # puts "subdomain is: #{subdomain}"
      unless request.subdomain == subdomain
        render_404
      end
    end


  end
end