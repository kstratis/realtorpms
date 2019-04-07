class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  # protect_from_forgery with: :exception, prepend: true
  # protect_from_forgery prepend: true
  include SessionsHelper
  rescue_from ActiveRecord::RecordNotFound, with: -> { render_404  }
  before_action :set_locale

  layout :layout_by_resource

  def set_locale
    I18n.locale = params[:locale] || current_user.try(:locale) || I18n.default_locale
  end

  # def default_url_options
  #   { locale: I18n.locale }
  # end

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
      format.html { render :file => "#{Rails.root}/public/404", :layout => false, :status => :not_found }
      format.xml  { head :not_found }
      format.any  { head :not_found }
    end
  end

  def render_401
    respond_to do |format|
      format.html { render :file => "#{Rails.root}/public/401", :layout => false, :status => :unauthorized }
      format.xml  { head :unauthorized }
      format.any  { head :unauthorized }
    end
  end

  private

  def layout_by_resource
    if devise_controller?
      "registration/main"
    else
      "application"
    end
  end

end
