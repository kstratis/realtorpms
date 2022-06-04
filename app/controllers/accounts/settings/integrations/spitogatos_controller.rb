module Accounts
  module Settings
    module Integrations
      class SpitogatosController < Accounts::BaseController
        skip_before_action :verify_authenticity_token
        before_action :fetch_configuration, except: [:create]

        layout 'settings'

        def show
          redirect_to new_settings_integrations_spitogato_path if @spitogatos.blank?
        end

        def new
          redirect_to settings_integrations_spitogato_path(@spitogatos) and return if @spitogatos.present?

          @spitogatos = current_account.build_spitogatos
        end

        def create
          @spitogatos = current_account.build_spitogatos(spitogatos_params)
          if @spitogatos.save
            flash[:success] = I18n.t("settings.sidebar.integrations.spitogatos.flash.add_success")
            redirect_to settings_integrations_spitogato_path(@spitogatos)
          else
            flash[:danger] = I18n.t("settings.sidebar.integrations.spitogatos.flash.add_failure")
            render :new
          end
        end

        def edit; end

        def destroy
          if @spitogatos.destroy!
            flash[:success] = I18n.t('settings.sidebar.integrations.spitogatos.flash.destroy_success')
            redirect_to settings_integrations_root_path
          else
            flash[:danger] = I18n.t('settings.sidebar.integrations.spitogatos.flash.destroy_failure')
            render :edit
          end
        end

        def update
          if @spitogatos.update(spitogatos_params)
            flash[:success] = I18n.t('settings.sidebar.integrations.spitogatos.flash.edit_success')
            redirect_to settings_integrations_spitogato_path(@spitogatos)
          else
            flash[:danger] = I18n.t('settings.sidebar.integrations.spitogatos.flash.edit_failure')
            render :edit
          end
        end

        def validate_configuration
          @spitogatos = current_account.spitogatos
          render json: {}, status: :ok and return if @spitogatos.blank?

          result = @spitogatos.check_connection

          response = if result == :active
                       { status: 'ok', message: I18n.t('settings.sidebar.integrations.spitogatos.status.success') }
                     else
                       { status: 'error', message: I18n.t('settings.sidebar.integrations.spitogatos.status.error') }
                     end
          render json: response, status: :ok
        end

        private

        def fetch_configuration
          @spitogatos = current_account.spitogatos
        end

        def spitogatos_params
          params.require(:spitogatos).permit(:broker_id, :username, :password)
        end
      end
    end
  end
end