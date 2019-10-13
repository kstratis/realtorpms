module Accounts
  class SettingsController < Accounts::BaseController
    before_action :set_accounts_setting, only: [:show, :edit, :update, :destroy]

    # GET /accounts/settings
    # GET /accounts/settings.json
    def index
      # @accounts_settings = Accounts::Setting.all
      @properties_id = current_account.model_types.find_by(name: 'properties').id
      @users_id = current_account.model_types.find_by(name: 'users').id
      @clients_id = current_account.model_types.find_by(name: 'clients').id
    end

    # GET /accounts/settings/1
    # GET /accounts/settings/1.json
    def show
    end

    # GET /accounts/settings/new
    def new
      @accounts_setting = Accounts::Setting.new
    end

    # GET /accounts/settings/1/edit
    def edit
    end

    # POST /accounts/settings
    # POST /accounts/settings.json
    def create
      @accounts_setting = Accounts::Setting.new(accounts_setting_params)

      respond_to do |format|
        if @accounts_setting.save
          format.html { redirect_to @accounts_setting, notice: 'Setting was successfully created.' }
          format.json { render :show, status: :created, location: @accounts_setting }
        else
          format.html { render :new }
          format.json { render json: @accounts_setting.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /accounts/settings/1
    # PATCH/PUT /accounts/settings/1.json
    def update
      respond_to do |format|
        if @accounts_setting.update(accounts_setting_params)
          format.html { redirect_to @accounts_setting, notice: 'Setting was successfully updated.' }
          format.json { render :show, status: :ok, location: @accounts_setting }
        else
          format.html { render :edit }
          format.json { render json: @accounts_setting.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /accounts/settings/1
    # DELETE /accounts/settings/1.json
    def destroy
      @accounts_setting.destroy
      respond_to do |format|
        format.html { redirect_to accounts_settings_url, notice: 'Setting was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_accounts_setting
      @accounts_setting = Accounts::Setting.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def accounts_setting_params
      params.fetch(:accounts_setting, {})
    end
  end
end