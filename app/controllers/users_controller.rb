class UsersController < ApplicationController
  before_action :logged_in_user, only: [:index, :edit, :update]
  before_action :correct_user,   only: [:edit, :update]
  layout 'registration/main', except: [:show, :edit, :update, :index]  # show the barebones version only when signing up

  # GET the new user registration page
  def new  # This is basically the registration page in GET
    @user = User.new
  end

  def index
    @users = User.paginate(page: params[:page])
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
      params.require(:user).permit(:first_name, :last_name, :email, :age, :phone1, :password, :password_confirmation)
    end
  # Confirms a logged-in user.

    def logged_in_user
      unless logged_in?
        store_location
        redirect_to login_url
      end
    end


      # Confirms the correct user.
    def correct_user
      @user = User.find(params[:id])
      unless current_user?(@user)
        flash[:danger] = 'You can\'t edit another user\'s profile'
        redirect_to(root_url)
      end
    end
end
