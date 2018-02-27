class InvitationreceiversController < ApplicationController

  layout 'website/skeleton'  # show the barebones version only when signing up/in

  def accept
    store_location unless logged_in?
    @invitation = Invitation.find_by!(token: params[:id])
    @user = User.new
  end

  def accepted

    # +find_by!+ throws exception if invitation is not found
    @invitation = Invitation.find_by!(token: params[:id])


    if logged_in?
      user = current_user
    else
      user_params = params[:user].permit(
          :email,
          :first_name,
          :last_name,
          :password,
          :password_confirmation
      )
      # +create!+ is an active record method not a users controller one
      user = User.create!(user_params)
      log_in(user)
    end

    current_account.users << user

    # puts "current_account.subdomain is #{current_account.subdomain}"
    # redirect_to root_url
    flash[:success] = "You have successfully joined the #{current_account.subdomain} organization."
    # puts "the redirect will be on: #{root_url(subdomain: current_account.subdomain)}"
    redirect_to root_url(subdomain: current_account.subdomain)
  end

  private
    # this is only called from the template properties#index
    def current_account
      # puts "inside the method invitations is #{@invitation}"
      # this results in 404 in production
      Account.find_by!(subdomain: @invitation.account.subdomain)
    end

end
