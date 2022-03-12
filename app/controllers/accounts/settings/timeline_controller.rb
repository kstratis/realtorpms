module Accounts
  module Settings

    class TimelineController < Accounts::BaseController
      layout 'settings'
      before_action :admin_access
      # before_action :set_accounts_setting, only: [:show, :edit, :update, :destroy]

      # GET /accounts/settings
      # GET /accounts/settings.json
      def index
        # @accounts_settings = Accounts::Setting.all
        @properties_id = current_account.model_types.find_by(name: 'properties').id
        @users_id = current_account.model_types.find_by(name: 'users').id
        @clients_id = current_account.model_types.find_by(name: 'clients').id

        # This basically finds the latest 5 entries of the last 5 groups of events partitioned by day with a maximum of 25 total entries
        # References:
        # https://stackoverflow.com/questions/1313120/retrieving-the-last-record-in-each-group-mysql
        # https://stackoverflow.com/questions/6133107/extract-date-yyyy-mm-dd-from-a-timestamp-in-postgresql
        # https://stackoverflow.com/questions/1124603/grouped-limit-in-postgresql-show-the-first-n-rows-for-each-group
        # https://stackoverflow.com/questions/55278576/postgresql-limit-by-n-groups
        # https://docs.microsoft.com/en-us/sql/t-sql/functions/dense-rank-transact-sql?view=sql-server-2017
        # http://www.postgresqltutorial.com/postgresql-dense_rank-function/
        sql = %{
          SELECT
            *
          FROM (
            SELECT
              ROW_NUMBER() OVER (PARTITION BY created_at::date ORDER BY created_at::time DESC) AS row_number,
              DENSE_RANK() OVER (ORDER BY created_at::date DESC) AS group_number, l.*
            FROM
              logs l
            WHERE account_id=#{current_account.id}) subquery
          WHERE
            subquery.row_number <= 5
            AND group_number <=5
          ORDER BY created_at DESC
          LIMIT 25;
        }.gsub(/\s+/, " ").strip
        @events = Log.find_by_sql(sql).group_by{ |t| t.created_at.beginning_of_day }
      end

      # GET /accounts/settings/1
      # GET /accounts/settings/1.json
      def show
      end

      # GET /accounts/settings/new
      def new
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
        # puts '========================='
        # puts @accounts_setting
        # debug
        # puts '========================='
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def accounts_setting_params
        params.fetch(:accounts_setting, {})
      end
    end
  end
end