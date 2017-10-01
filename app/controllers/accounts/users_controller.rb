require 'users_helper'
module Accounts
  class UsersController < Accounts::BaseController
    # before_action :logged_in_user, only: [:index, :edit, :update, :destroy]
    before_action :correct_user,   only: [:edit, :update]
    before_action :owner_exclusive, only: [:edit, :destroy]
    layout 'registration/main', except: [:show, :edit, :update, :index]  # show the barebones version only when signing up

    def destroy
        User.find(params[:id]).destroy
        flash[:success] = 'User successfully deleted'
        redirect_to users_url
    end

    # GET the new user registration page
    def new  # This is basically the registration page in GET
      @user = User.new
    end

    def index
      # page number validation
      if params[:page]
        param = Integer(params[:page]) rescue nil
        unless param.is_a? Integer
          render_404 and return
        end
      end

      @users = User.all

      if params[:search]
        @users = @users.search(params[:search])
      end

      if params[:sorting] && params[:ordering]
        @users = @users.order("#{params[:sorting]}": params[:ordering])
      else
        @users = @users.order(:created_at)
      end

      # puts @users.to_yaml

      @users = @users.paginate(page: params[:page], :per_page => 10)
      # @users = User.paginate(page: params[:page], :per_page => 10)
      @userslist = {:dataset => Array.new}
      # All the data we need - SOS
      # puts @users.total_entries # total user entries
      # puts @users.total_pages # page count
      # puts @users.current_page # current page
      @users.each do |user|
        hash = {
            id: user.id,
            avatar_url: "https://secure.gravatar.com/avatar/#{Digest::MD5::hexdigest(user.email.downcase)}?s=64",
            name: "#{user.first_name.first}. #{user.last_name}",
            email: user.email,
            type: user.admin ? 'Admin' : 'User',
            view_entity_path: user_path(user.id),
            edit_entity_path: edit_user_path(user.id),
            # assignments: user.properties.count,
            # registration: user.created_at.to_formatted_s(:long)
            registration: user.created_at.strftime('%d %b. %y')
        }
        @userslist[:dataset] << hash
      end
      # The following entries are only for the first render
      @total_entries = @users.total_entries
      @current_page = @users.current_page
      @results_per_page = 10
      @initial_search = params[:search] || ''
      @initial_sorting = params[:sorting] || 'created_at'
      @initial_ordering = params[:ordering] || 'desc'

      respond_to do |format|
          format.html
          format.json {render json: {results_per_page: @results_per_page,
                                     userslist: @userslist,
                                     total_entries: @users.total_entries,
                                     current_page: @users.current_page }, status: 200}
      end

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
      # def logged_in_user
      #   unless logged_in?
      #     store_location
      #     redirect_to login_url
      #   end
      # end

      # Confirms the correct user.
      def correct_user
        @user = User.find(params[:id])
        unless current_user?(@user)
          flash[:danger] = 'You can\'t edit another user\'s profile'
          redirect_to(root_url)
        end
      end

      # Confirms an admin user.
      def admin_user
        redirect_to(root_url) unless current_user.admin?
      end

      def owner_exclusive
        unless owner?
          flash[:danger] = 'Only the account owner may perform this action.'
          redirect_to users_url
        end
      end

  end
end

