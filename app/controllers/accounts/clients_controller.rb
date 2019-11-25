module Accounts
  class ClientsController < Accounts::BaseController
    helper Cfields

    before_action :verify_client, only: [:edit, :update, :show, :destroy]
    after_action :log_action, only: [:create, :update, :destroy]

    def index
      if current_user.is_admin?(current_account)
        filter_persons(current_account.clients, params)
      else
        filter_persons(current_user.clients, params)
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
      @client_full_name = @client.full_name
      @client.destroy
      flash[:success] = I18n.t 'clients.flash_delete'
      redirect_to clients_url
    end

    def new
      @client = current_account.clients.new(model_type: current_account.model_types.find_by(name: 'clients'))
    end

    def create
      @client = Client.new(client_params)
      @client.account = current_account
      @client.model_type = current_account.model_types.find_by(name: 'clients')
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
      filter_properties(current_account.properties.includes(:location), searchprefs)
    end

    private
      def client_params
        params.require(:client).permit(:first_name, :last_name, :email, :telephones, :job, :notes, :brokerlistingagreement, :buyerbrokeragreement, {preferences: {}})
      end

      def log_action
        if action_name == 'destroy'
          Log.create(author: current_user, author_name: current_user.full_name, client_name: @client_full_name, action: action_name, account: current_account, account_name: current_account.subdomain, entity: 'clients')
        else
          Log.create(author: current_user, author_name: current_user.full_name, client_name: @client.full_name, client: @client, action: action_name, account: current_account, account_name: current_account.subdomain, entity: 'clients')
        end
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