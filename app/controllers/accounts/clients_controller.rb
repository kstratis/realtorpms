module Accounts
  class ClientsController < Accounts::BaseController
    helper Cfields
    helper ForbiddenIds

    before_action :set_client, only: [:show, :edit, :update, :destroy]
    before_action :redirect_to_index, :if => :forbid_access?, :only => [:edit, :update, :show, :destroy]

    after_action :log_action, only: [:create, :update, :destroy], unless: Proc.new { current_user.is_sysadmin? }

    attr_reader :client
    helper_method :client

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
      if @client.update(client_params)
        flash[:success] = I18n.t 'clients.flash_profile_updated'
        redirect_to @client
      else
        flash[:danger] = I18n.t('clients.flash_not_updated')
        render :edit
      end
    end

    def destroy
      @client_full_name = @client.full_name
      @client.destroy
      flash[:success] = I18n.t('clients.flash_delete')
      redirect_to clients_path
    end

    def new
      first_name, last_name = handle_prefilled_attrs
      attrs = {
        first_name: first_name.presence,
        last_name: last_name.presence
      }
      @client = current_account.clients.new({model_type: current_account.model_types.find_by(name: 'clients')}.merge(attrs))
      respond_to do |format|
        format.html
        format.json {
          render json: { message: render_to_string(partial: "/accounts/clients/form", formats: [:html]) }
        }
      end
    end

    def create
      @client = current_account.clients.new(client_params)

      if @client.save  # model_type is automatically saved within a before_validation hook inside the model
        if current_user.role(current_account) == 'user'
          current_user.clients <<  @client
        end

        respond_to do |format|
          format.html do
            flash[:success] = I18n.t('clients.flash_created')
            redirect_to @client
          end
          # This responds to the inline form creation
          format.json {
            render json: { message: { label: @client.full_name, value: @client.id } }, status: :created
          }
        end
      else
        flash[:danger] = I18n.t('clients.flash_not_created')
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

    def mass_delete
      current_account.clients.where(id: params[:selection]).destroy_all
      flash[:success] = I18n.t('clients.flash_delete_multiple')
      render :json => { :status => "OK", message: clients_path }
    end

    private
      def handle_prefilled_attrs
        return if params[:name].nil?

        params[:name].split
      end

      def client_params
        params.require(:client).permit(:first_name, :last_name, :email, :telephones, :job, :notes, :ordertoview, :ordertosell, :ordertoviewfile, :ordertosellfile, {preferences: {}})
      end

      # Use callbacks to share common setup or constraints between actions.
      def set_client
        @client = current_account.clients.find(params[:id])
      end

      def forbid_access?
        forbidden_entity_ids('clients').include?(@client.id)
      end

      def redirect_to_index
        flash[:danger] = I18n.t('access_denied')
        redirect_to clients_path
      end

      def log_action
        if action_name == 'destroy'
          Log.create(author: current_user, author_name: current_user.full_name, client_name: @client_full_name, action: action_name, account: current_account, account_name: current_account.subdomain, entity: 'clients')
        else
          Log.create(author: current_user, author_name: current_user.full_name, client_name: @client.full_name, client: @client, action: action_name, account: current_account, account_name: current_account.subdomain, entity: 'clients')
        end
      end
  end
end