class HomeController < ApplicationController

  layout 'website/skeleton'  # show the barebones version only when signing up/in

  def index
  end

  # Use this action instead of directly linking to other urls from view
  # when we want use the flash functionality
  def switch
    if request.subdomain.blank?
      redirect_to root_url(subdomain: nil)
    else
      flash[:success] = "You are now signed in to #{request.subdomain}."
      redirect_to account_root_url(subdomain: request.subdomain)
    end
  end


end
