class UsersController < ApplicationController
  layout 'registration/main', except: [:show, :edit, :update]  # show the barebones version only when signing up

  # GET the new user registration page
  def new  # This is basically the registration page in GET
    @user = User.new
  end

  # POST to the new user registration page
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

  # GET the edit page
  def edit
    @user = User.find(params[:id])
  end

  # POST to the edit page
  def update
    @user = User.find(params[:id])
    if @user.update_attributes(user_params)
      flash[:success] = 'Your profile was successfully updated'
      redirect_to @user
      # Handle a successful update.
    else
      render 'edit'
    end
  end

  def show
    @user = User.find(params[:id]) # Automatically converts parameters from string to integer
  end

  private
    def user_params
      params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation)
    end
end
