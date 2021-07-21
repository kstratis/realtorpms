class PasswordResetsController < ApplicationController
  before_action :prompt_account, only: [:new, :edit]
  before_action :get_user,   only: [:edit, :update]
  before_action :valid_user, only: [:edit, :update]
  before_action :check_expiration, only: [:edit, :update]

  layout 'auth/skeleton'

  def new
  end

  def create
    if params[:password_reset][:email].blank?
      flash.now[:danger] = I18n.t 'sessions.flash_passwd_reset_email_empty'
      return render 'new'
    end
    @user = User.find_by(email: params[:password_reset][:email].try(:downcase))
    if @user
      unless @user.password_change_eligibility(request.subdomain)
        flash[:danger] = I18n.t 'sessions.flash_invalid_domain'
        return redirect_to root_url(subdomain: nil)
      end
      @user.create_reset_digest
      @user.send_password_reset_email(request.subdomain)
      flash[:info] = I18n.t 'sessions.flash_passwd_reset_email_sent'
      redirect_to login_url(locale: I18n.locale)
    else
      flash.now[:danger] = I18n.t 'sessions.flash_passwd_reset_email_not_found'
      render :new
    end
  end

  def edit
  end

  def update
    if params[:user][:password].blank?
      flash.now[:danger] = I18n.t 'sessions.flash_new_passwd_empty'
      render 'edit'
    elsif params[:user][:password] != params[:user][:password_confirmation]
      flash.now[:danger] = I18n.t 'sessions.flash_new_passwd_no_match'
      render 'edit'
    elsif @user.update(user_params)
      # log_in @user
      @user.update({reset_digest: nil})
      flash[:success] = I18n.t 'sessions.flash_passwd_reset_success'
      redirect_to login_url(subdomain: request.subdomain)
    else
      render 'edit'
    end
  end

  private

    def user_params
      params.require(:user).permit(:password, :password_confirmation)
    end

    def get_user
      @user = User.find_by(email: params[:email])
    end

    # Confirms a valid user.
    def valid_user
      unless @user && @user.authenticated?(:reset, params[:id])
        redirect_to root_url
      end
    end

    # Checks expiration of reset token.
    def check_expiration
      if @user.password_reset_expired?
        flash[:danger] = I18n.t 'sessions.flash_passwd_reset_expired'
        redirect_to password_reset_edit_url
      end
    end
end
