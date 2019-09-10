module Accounts
  class ClientsController < Accounts::BaseController

    def index
      if current_user.is_admin?(current_account)
        filter_users(current_account.clients)
      else
        filter_users(current_user.clients)
      end
    end

    def new
      @client = Client.new
      # @client.build_landlord
    end

    # POST to the new user registration page
    def create
      @client = Client.new(user_params)
      if @client.save
        flash[:success] = I18n.t('users.flash_welcome', brand: BRANDNAME)
        redirect_to root_url
        # Handle a successful save.
      else
        # this merely re-renders the new template.
        # It doesn't fully redirect (in other words it doesn't go through the +new+ method)
        render :new
      end
    end

    def show

    end

  end
end