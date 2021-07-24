class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  # protect_from_forgery with: :exception, prepend: true
  # protect_from_forgery prepend: true
  include SessionsHelper
  include UserAvatar
  helper UserAvatar
  include TimelineHelper

  rescue_from ActiveRecord::RecordNotFound, with: -> { render_404  }

  around_action :switch_locale
  around_action :set_time_zone, if: :current_user

  def switch_locale(&action)
    locale = params[:locale] || current_user.try(:locale) || extract_locale_from_accept_language_header || I18n.default_locale
    I18n.with_locale(locale, &action)
  end

  def current_account
    # this results in 404 in production
    @current_account ||= Account.find_by!(subdomain: request.subdomain)
  end

  helper_method :current_account

  # def default_url_options
  #   { locale: I18n.locale }
  # end
  #
  def prompt_account
    redirect_to account_list_url(subdomain: nil) if logged_in?
  end

  def hello
    render html: 'hello, world!'
  end

  def app_logger
    @@app_logger ||= Logger.new("#{Rails.root}/log/app.log", formatter: proc { |severity, datetime, progname, msg| "#{datetime}: #{msg}\n" })
  end

  # def not_found
  #   raise ActionController::RoutingError.new('Not Found')
  # end

  def render_404

    respond_to do |format|
      format.html { render :template => "404", :layout => false, :status => :not_found }
      format.xml  { head :not_found }
      format.any  { head :not_found }
    end
  end

  def render_401
    respond_to do |format|
      format.html { render :template => "401", :layout => false, :status => :unauthorized }
      format.xml  { head :unauthorized }
      format.any  { head :unauthorized }
    end
  end

  private
    def set_time_zone(&block)
      Time.use_zone(current_user.time_zone, &block)
    end

    def extract_locale_from_accept_language_header
      request.env['HTTP_ACCEPT_LANGUAGE'].scan(/^[a-z]{2}/).first
    end
end
