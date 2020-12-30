module Accounts
  class BaseController < ApplicationController

    include RolesAccess
    include SearchFilter
    include ForbiddenIds
    include PersonDatatable
    include PropertyDatatable
    include Jsonifier
    include CalendarEvents

    helper UserAvatar

    # This comes from sessions_helper.rb which is included by application_controller.
    # It helps us know if a user is currently masquerading
    helper_method :masquerading?
    helper_method :masqueraded_admin

    # before_action :logged_in_user, :allowed_subdomains, only: [:index, :edit, :update, :destroy]
    before_action :logged_in_user, :allowed_subdomains, :active_account, :active_user # The order is guaranteed from left-to-right
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

    def owner?
      current_account.owner == current_user
    end

    helper_method :owner?

    def logged_in_user
      return true if controller_name == 'confirmations'

      unless logged_in?
        store_location
        redirect_to login_url
      end
    end

    # Users banned users with more than 1 account get to the account selection screen
    # Users belonging to a single account just get redirected to the login screen
    def active_user
      unless owner? || current_user.is_sysadmin? # owners' relation to accounts is not determined by the Membership table
        unless Membership.find_by(account: current_account, user: current_user).try(:active) # use try here cause the membership entry may not exist
          if current_user.get_account_count > 1
            redirection = proc { redirect_to account_list_url(subdomain: false) and return }
          else
            log_out if logged_in?
            redirection = proc { redirect_to root_url(subdomain: request.subdomain) }
          end
          flash[:danger] = I18n.t "sessions.flash_suspended"
          redirection.call
        end
      end
    end

    def active_account
      unless current_account.email_confirmed? || current_user.is_sysadmin? || sys_admin_masquerading?
        redirect_to lockout_path
      end
    end

    def store_referer_url
      session[:referrer_subdomain] = request.subdomain if request.get?
    end

    def allowed_subdomains
      accounts = current_user.is_sysadmin? ? Account.all : current_user.all_accounts
      subdomain_list = accounts.pluck(:subdomain)
      unless session[:referrer_subdomain].blank?
        previous_subdomain = session[:referrer_subdomain]
        unless previous_subdomain == request.subdomain
          Account.find_by!(subdomain: request.subdomain)
          if subdomain_list.include? request.subdomain
            flash.now[:success] = I18n.t "accounts.switch_domain", subdomain: request.subdomain
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