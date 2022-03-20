class HomeController < ApplicationController
  # render :action => 'accounts', :layout => 'auth/skeleton'
  # layout 'auth/skeleton', only: [:accounts]  # show the barebones version only when signing up/in
  # layout 'website/skeleton'
  before_action :client_country
  before_action :locale_switch_dismissed

  def index
    @subdomain = nil
    render :layout => 'website/skeleton'
  end

  # Use this action instead of directly linking to other urls from view
  # when we need use the flash functionality
  def switch
    if request.subdomain.blank?
      redirect_to landing_root_url(subdomain: nil, locale: I18n.locale)
    else
      flash[:success] = I18n.t 'accounts.switch_info'
      redirect_to account_root_url(subdomain: request.subdomain)
    end
  end

  def accounts
    return redirect_to landing_root_url(subdomain: nil, locale: I18n.locale) if current_user.nil? || masquerading?
    # return redirect_to account_root_url(subdomain: request.referrer) if masquerading?
    # @accounts = current_user.admin? ? Account.all : current_user.all_accounts
    # @properties = @properties.paginate(page: params[:page], :per_page => 10)
    # byebug
    @accounts = current_user.is_sysadmin? ? Account.all.paginate(page: params[:page], :per_page => 25) : current_user.all_accounts.paginate(page: params[:page], :per_page => 25)
    render :layout => 'auth/skeleton'
  end

  # footer
  def tos
    render :layout => 'website/skeleton'
  end

  # footer
  def privacy
    render :layout => 'website/skeleton'
  end

  # footer
  def cookie
    render :layout => 'website/skeleton'
  end
end
