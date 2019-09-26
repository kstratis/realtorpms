module Accounts
  class ClientsController < Accounts::BaseController

    before_action :verify_client, only: [:edit, :update, :show, :destroy]

    def index
      if current_user.is_admin?(current_account)
        filter_persons(current_account.clients)
      else
        filter_persons(current_user.clients)
      end
    end

    def edit

    end

    def update
      if @client.update_attributes(client_params)
        flash[:success] = I18n.t 'clients.flash_profile_updated'
        redirect_to @client
        # Handle a successful update.
      else
        render :edit
      end
    end

    def destroy
      @client.destroy
      flash[:success] = I18n.t 'clients.flash_delete'
      redirect_to clients_url
    end

    def new
      @client = Client.new
      # @client.build_landlord
    end

    def create
      @client = Client.new(client_params)
      @client.account = current_account
      if @client.save
        if current_user.role(current_account) == 'user'
          current_user.clients <<  @client
        end
        flash[:success] = I18n.t('clients.flash_created')
        redirect_to @client
        # Handle a successful save.
      else
        # DEBUG
        # @client.errors.each do |attr, msg|
        #   puts attr, msg
        # end
        # this merely re-renders the new template.
        # It doesn't fully redirect (in other words it doesn't go through the +new+ method)
        render :new
      end
    end

    def show
      if @client.searchprefs.blank?
        return
      end
      searchprefs = @client.searchprefs
      searchprefs.slice!(0)
      searchprefs = Rack::Utils.parse_query(searchprefs).deep_symbolize_keys
      searchprefs.except!(:sizeminmeta, :sizemaxmeta, :page)
      searchprefs[:page] = params[:page]
      filter_properties(current_account.properties.includes(:location, :landlord), searchprefs)
    end

    private
      def client_params
        params.require(:client).permit(:first_name, :last_name, :email, :telephones, :job, :notes)
      end

      def verify_client
        if current_user.is_admin?(current_account)
          @client = current_account.clients.find(params[:id])
        else
          @client = current_user.clients.find(params[:id])
        end
        unless @client
          flash[:danger] = I18n.t 'clients.flash_not_found'
          redirect_to(root_url)
        end
      end
  end
end