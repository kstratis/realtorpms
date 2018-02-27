class HomeController < ApplicationController

  layout 'website/skeleton'  # show the barebones version only when signing up/in

  def index
    @subdomain = nil
    # if logged_in?
    #   if current_user.accounts.count == 0
        # exclude the admin case who may not have a linked account
        # unless current_user.is_admin?
        #   @subdomain = Account.find_by(owner_id: current_user.id).subdomain
        # end
      # end
    # end
  end

  # Use this action instead of directly linking to other urls from view
  # when we need use the flash functionality
  def switch
    if request.subdomain.blank?
      redirect_to root_url(subdomain: nil)
    else
      flash[:success] = "You are now signed in to #{request.subdomain}."
      redirect_to account_root_url(subdomain: request.subdomain)
    end
  end

  def accounts
    @accounts = current_user.is_admin? ? Account.all : current_user.all_accounts
  end


end
