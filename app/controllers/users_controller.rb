class UsersController < ApplicationController
  layout 'registration/main', except: [:show]  # show the barebones version only when signing up

  def new  # This is basically the registration page in GET
    @user = User.new
  end

  def show
    @user = User.find(params[:id]) # Automatically converts parameters from string to integer
  end

  def create
    @user = User.new(user_params)
    if @user.save
      # Handle a successful save.
    else
      render 'new'

    end
  end

  private
    def user_params
      params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation)
    end
end
