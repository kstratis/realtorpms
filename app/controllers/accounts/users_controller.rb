module Accounts
  class UsersController < Accounts::BaseController
    helper Cfields
    # Shows all account users
    before_action :all_account_users, only: [:show]
    before_action :user_self, only: [:edit, :update, :show] # Allows editing only on each user's self
    before_action :owner_exclusive, only: [:new, :create, :destroy, :index, :mass_delete, :mass_freeze]
    before_action :check_page_validity, only: [:index]
    before_action :find_user!, only: [:delete_avatar, :toggle_activation, :toggle_adminify, :toggle_tour, :show]
    after_action :log_action, only: [:create, :update, :destroy], unless: Proc.new { current_user.is_sysadmin? }
    after_action :set_assignments, only: [:create]
    # A model's +destroy+ method is different than the controller's +destroy+ action.
    # - Using the model's destroy method on a user object should delete all its dependancies (memberships, assignments,
    # clientships and favlists), its owning account and the user itself.
    # - Using the model's destroy method on an account object should delete all the account's assets
    # (memberships, assignments, clientships and favlists) except the actual users (and the account's owner) because
    # they may belong to multiple other accounts.
    # - Using the controller's destroy method on a user object only deletes its assets on the given account.
    def destroy
      @user = User.find(params[:id])
      @user_full_name = @user.full_name
      if @user.get_account_count > 1
        delete_user_assets(@user, current_account)
      else
        @user.destroy
      end
      flash[:success] = I18n.t "users.flash_delete"
      redirect_to users_url
    end

    # GET the new user registration page - This is basically the registration page in GET
    def new
      @user = current_account.users.new
    end

    # This is only accessible by account owners so no need to granulate its access
    def index
      # params because the required :user key of the filtered +user_params+ is only available in POST requests
      filter_persons(current_account.send("#{params["backend_option"] || ""}users"), params)
    end

    # POST to the new user registration page
    def create
      @user = current_account.users.new(user_params)
      if @user.save
        # log_in @user
        current_account.users << @user
        current_account.model_types.find_by(name: "users").users << @user

        flash[:success] = I18n.t("users.flash_user_added")
        redirect_to @user
      else
        flash[:danger] = I18n.t("users.flash_user_add_failed")
        # this merely re-renders the new template.
        # It doesn't fully redirect (in other words it doesn't go through the +new+ method)
        render :new
      end
    end

    # GET the edit page
    def edit
      # We already get +@user+ from +user_self+. Nothing to do here... yet...
    end

    # POST to the edit page
    def update
      # If a user belongs to multiple accounts we need to keep cfields data of both accounts and not overwrite each other
      if @user.update(user_params.merge(preferences: @user.preferences.merge(user_params[:preferences] || {})))
        # Handle a successful update.
        flash[:success] = I18n.t "users.flash_profile_updated"
        if @user.is_sysadmin?
          redirect_to edit_user_path(@user)
        else
          redirect_to @user
        end
      else
        flash[:danger] = I18n.t("users.flash_user_update_failed")
        render :edit
      end
    end

    def show
      @is_admin = @user.is_admin?(current_account)
      if @is_admin
        filter_properties(current_account.properties.includes(:location), { page: params[:page], purpose: 'sell_rent' })
      else
        filter_properties(@user.properties.includes(:location), { page: params[:page], purpose: 'sell_rent' })
      end
    end

    def delete_avatar
      @user.avatar.purge if @user.avatar.attached?
      redirect_to edit_user_path(@user)
    end

    def toggle_activation
      Membership.find_by(account: current_account, user: @user).toggle!(:active)
      render json: { status: "OK", user_active: Membership.find_by(account: current_account, user: @user).active }
    end

    def toggle_adminify
      Membership.find_by(account: current_account, user: @user).toggle!(:privileged)
      render json: { status: "OK", user_privileged: Membership.find_by(account: current_account, user: @user).privileged }
    end

    # PATCH `toggle_tour_user_url(USERID)`
    def toggle_tour
      # `@user` will be `nil` if logging in as sysadmin
      # Chek `find_user!` for more context
      if @user.present?
        @user.toggle!(:has_taken_tour)
      end
      render json: { message: "OK" }, status: 200
    end

    def tour_data
      respond_to do |format|
        format.json {
          render json: { message: render_to_string(partial: 'layouts/tour', formats: [:html]) }
        }
      end
    end

    def mass_delete
      current_account.users.where(id: params[:selection]).destroy_all
      flash[:success] = I18n.t('users.flash_delete_multiple')
      render json: { status: "OK", message: users_path, meta: params[:selection] }
    end

    def mass_freeze
      Membership.where(account: current_account, user: params[:selection]).each { |entry| entry.toggle!(:active) }
      render json: { status: "OK", message: users_path, meta: params[:selection] }
    end

    private

    def user_params
      params.require(:user).permit(:avatar, :first_name, :last_name, :email, :dob, :phone1, :locale, :time_zone, :password, :password_confirmation, :multi_assign, { preferences: {} })
    end

    # Finds the given or throws
    def find_user!
      @user = current_account.all_users.find(params[:id])
    end

    # Deletes all user assets but the user himself
    def delete_user_assets(user, account)
      Membership.find_by(account: account, user: user).destroy # This one is unique
      Assignment.where(user: user).joins(:property).where(properties: { account: account }).try(:destroy_all)
      Clientship.where(user: user).joins(:client).where(clients: { account: account }).try(:destroy_all)
      Favlist.where(account: account, user: user).try(:destroy_all)
    end

    # Logs the creation, update and destruction of user objects.
    # The creation of user object is only happening through invitation thus the creation part
    # remains unused here and is only utilized by the invitationreceivers_controller.rb
    def log_action

      if action_name == "destroy"
        Log.create(author: current_user, author_name: current_user.full_name, user_name: @user_full_name, action: action_name, account: current_account, account_name: current_account.subdomain, entity: "users")
      else
        Log.create(author: current_user, author_name: current_user.full_name, user_name: @user.full_name, user: @user, action: action_name, account: current_account, account_name: current_account.subdomain, entity: "users")
      end
    end

    def set_assignments
      return unless ActiveRecord::Type::Boolean.new.cast(user_params[:multi_assign])

      @user.properties << current_account.properties
    end

    def all_account_users
      # We use find_by instead of find because we need an association proxy and not just an object
      @user = current_account.all_users.find_by(id: params[:id])
      if @user.nil?
        flash[:danger] = I18n.t "users.flash_user_not_found"
        redirect_to users_path
      end
    end

    # Confirms that an action concerning a particular user is initiated by that same user or an admin.
    # Essentially prevents admins modifying others users' data.
    def user_self
      @user = current_user
      return if current_user.is_admin?(current_account)

      @user = current_account.users.find(params[:id])
      return if current_user?(@user)

      flash[:danger] = I18n.t "users.flash_unauthorised_user_edit"
      redirect_to(account_root_url)
    end

    # Confirms an admin user.
    def admin_user
      redirect_to(account_root_url) unless current_user.is_sysadmin?
    end

    def owner_exclusive
      unless current_user.is_admin?(current_account)
        flash[:danger] = I18n.t "users.flash_owner_only_action"
        redirect_to account_root_url
      end
    end
  end
end
