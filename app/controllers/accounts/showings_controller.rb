module Accounts
  class ShowingsController < Accounts::BaseController
    before_action :find_property!

    def index
      render json: {status: "OK", message: showings}
    end

    def create
      if current_user.is_admin?(current_account)
        @client = current_account.clients.find(showing_params[:client][:value])
        @user = current_account.all_users.find(showing_params[:partner][:value])
      else
        @client = current_user.clients.find(showing_params[:client][:value])
        @user = current_user
      end

      dateStr = DateTime.parse(showing_params[:dateStr])
      @cpa = Cpa.new(property: @property, client: @client, user: @user, created_at: dateStr, updated_at: dateStr, viewership: true, ownership: false)
      if @cpa.save
        render json: {status: "OK", message: showings}
      else
        flash[:danger] = I18n.t('viewings.flash_error')
        render json: {status: "Error", message: showings}
      end
    end

    def delete
      puts 'DELETE WORKING'
      puts showing_params
      Cpa.find(showing_params['showing_id']).destroy
      render json: {status: "OK", message: showings}
    end

    private

      def showings
        showings = Array.new
        dbdata = Cpa.where(property: @property, viewership: true).includes(:client, :user)
        dbdata.each do |entry|
          showings << {
              id: entry.id,
              client: (current_user.is_admin?(current_account) || current_user.clients.include?(entry.try(:client))) ? (entry.try(:client).try(:full_name) || '—') : '*****',
              client_url: (current_user.is_admin?(current_account) || current_user.clients.include?(entry.try(:client))) ? client_path(entry.try(:client)) : '',
              user: entry.try(:user).try(:full_name) || '—',
              user_url: entry.try(:user) ? user_path(entry.try(:user)) : '',
              date_string: I18n.l(entry.created_at, format: :custom),
              canBeDeleted: (current_user.is_admin?(current_account) || current_user == entry.try(:user)) ? true : false
          }
        end
        showings
      end

      def find_property!
        @property = current_account.properties.find(params['property_id'])
      end

      def showing_params
        params.require(:showing).permit({client: [:label, :value, :__isNew__]}, {partner: [:label, :value]}, :dateStr, :property_id, :showing_id)
      end

  end
end
