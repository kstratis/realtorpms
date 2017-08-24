class HomeController < ApplicationController
  # before_action :logged_in_user, only: [:index]
  layout 'website/skeleton'  # show the barebones version only when signing up/in

  def index
  end


  # private
    # Confirms a logged-in user.
    # def logged_in_user
    #   unless logged_in?
    #     store_location
    #     redirect_to login_url
    #   end
    # end

end
