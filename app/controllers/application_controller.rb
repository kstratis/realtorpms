class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  # protect_from_forgery with: :exception, prepend: true
  # protect_from_forgery prepend: true
  include SessionsHelper
  rescue_from ActiveRecord::RecordNotFound, with: -> { render_404  }

  def hello
    render html: 'hello, world!'
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

end
