class PasswordResetsController < ApplicationController
  layout 'registration/main'

  def new
  end

  def create
    if params[:password_reset][:email].blank?
      flash.now[:danger] = "The Email address field cant be empty"
      return render 'new'
    end
    @user = User.find_by(email: params[:password_reset][:email].try(:downcase))
    if @user
      @user.create_reset_digest
      @user.send_password_reset_email
      flash[:info] = "Email sent with password reset instructions"
      redirect_to root_url
    else
      flash.now[:danger] = "Email address not found"
      render :new
    end
  end

  def edit
  end
end
