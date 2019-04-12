class PasswordResetsController < ApplicationController
  before_action :get_user,   only: [:edit, :update]
  before_action :valid_user, only: [:edit, :update]
  before_action :check_expiration, only: [:edit, :update]

  layout 'auth/skeleton'

  def new
  end

  def create
    if params[:password_reset][:email].blank?
      flash.now[:danger] = "The Email address field cant be empty"
      return render 'new'
    end
    @user = User.find_by(email: params[:password_reset][:email].try(:downcase))
    if @user
      unless @user.password_change_eligibility(request.subdomain)
        flash[:danger] = "Invalid domain"
        return redirect_to root_url(subdomain: nil)
      end
      @user.create_reset_digest
      @user.send_password_reset_email(request.subdomain)
      flash[:info] = "Email sent with password reset instructions"
      redirect_to root_url
    else
      flash.now[:danger] = "Email address not found"
      render :new
    end
  end

  def edit
  end

  def update
    if params[:user][:password].blank?
      flash.now[:danger] = "The new password can't be empty"
      render 'edit'
    elsif params[:user][:password] != params[:user][:password_confirmation]
      flash.now[:danger] = "Your passwords dont match"
      render 'edit'
    elsif @user.update_attributes(user_params)
      # log_in @user
      @user.update_attribute(:reset_digest, nil)
      flash[:success] = "Your Password has been reset."
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
        flash[:danger] = "Password reset has expired."
        redirect_to password_reset_edit_url
      end
    end
end
