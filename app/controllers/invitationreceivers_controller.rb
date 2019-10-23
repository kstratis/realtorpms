class InvitationreceiversController < ApplicationController

  after_action :log_action, only: [:accepted]

  layout 'auth/skeleton'  # Auth template

  # When clicking on an invite link, always store the url;
  # It may come handy once an (existing?) user logs in
  def accept
    store_location unless logged_in?
    @invitation = Invitation.find_by!(token: params[:id])
    @user = User.new
  end

  def accepted
    # +find_by!+ throws exception if invitation is not found
    @invitation = Invitation.find_by!(token: params[:id])

    if logged_in?
      @user = current_user
      if @user.is_owner?(current_account)
        @invitation.destroy!
        flash[:danger] = I18n.t('invitations.accepted.flash_existing', account: current_account.subdomain)
        redirect_to root_url(subdomain: current_account.subdomain) and return
      end
    else
      user_params = params[:user].permit(
          :email,
          :first_name,
          :last_name,
          :password,
          :password_confirmation
      )
      # +create!+ is an active record method not a users controller one. Used to be:
      # user = User.create!(user_params)
      @user = User.new(user_params)
      if @user.save
        log_in(@user)
      else
        render :accept and return
      end

    end

    current_account.users << @user
    current_account.model_types.find_by(name: 'users').users << @user

    @invitation.destroy!

    # puts "current_account.subdomain is #{current_account.subdomain}"
    # redirect_to root_url
    flash[:success] = I18n.t('invitations.accepted.flash_success', account: current_account.subdomain)
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

    def log_action
      Log.create(author: current_account.owner, author_name: current_account.owner.full_name, user_name: @user.full_name, user: @user, action: action_name, account: current_account, account_name: current_account.subdomain, entity: 'users')
    end

end
