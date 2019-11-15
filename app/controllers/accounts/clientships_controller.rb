module Accounts
  class ClientshipsController < Accounts::BaseController
    include AddRemoveAssociationsHandler
    before_action :authorize_owner_rest!

    # Calculates the diff between the existing and the requested assignments of a given property and applies it.
    def assign
      # Get the requested client
      client = current_account.clients.find(clientship_params[:cid])
      data = associations_handler(client, 'users', clientship_params[:selection])
      render :json => {:status => 200, :message => data, meta: I18n.t('js.components.select.assign_completed')} and return
    end

    private

      # Never trust parameters from the scary internet, only allow the white list through.
      def clientship_params
        params.permit(:cid, selection: [:label, :value], clientship: {})
      end

      def authorize_owner_rest!
        unless owner?
          respond_to do |format|
            format.json { render json: {message: 'Forbidden'}, status: 403 }
          end
        end
      end
  end
end


