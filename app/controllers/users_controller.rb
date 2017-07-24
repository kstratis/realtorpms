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
      log_in @user
      flash[:success] = 'Welcome to PropertyX'
      redirect_to @user
      # Handle a successful save.
    else
      # this merely re-renders the new template.
      # It doesn't fully redirect (in other words it doesn't go through the +new+ method)
      render 'new'
    end
  end

  private
    def user_params
      params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation)
    end
end
