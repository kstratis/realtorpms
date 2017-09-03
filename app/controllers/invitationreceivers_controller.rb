class InvitationreceiversController < ApplicationController

  layout 'website/skeleton'  # show the barebones version only when signing up/in

  def accept
    puts "the request is: #{request.original_url}"
    store_location

    @invitation = Invitation.find_by!(token: params[:id])
    @user = User.new
  end

  def accepted

    # +find_by!+ throws exception if invitation is not found
    @invitation = Invitation.find_by!(token: params[:id])
    user_params = params[:user].permit(
        :email,
        :first_name,
        :last_name,
        :password,
        :password_confirmation
    )
    # +create!+ is an active record method not a users controller one
    user = User.create!(user_params)
    puts @invitation
    current_account.users << user
    log_in(user)
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
