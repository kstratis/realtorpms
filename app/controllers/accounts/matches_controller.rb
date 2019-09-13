module Accounts
  class MatchesController < Accounts::BaseController

    # Saves the search preferences of a client
    def assign
      if current_user.is_admin?(current_account)
        requested_client = current_account.clients.find(match_params[:selection][:value])
      else
        requested_client = current_user.clients.find(match_params[:selection][:value])
      end
      requested_search = match_params[:searchstring]
      requested_client.searchprefs = requested_search
      if requested_client.save
        render json: {status: 200, message: ''}
      end
    end

    private
      # Never trust parameters from the scary internet, only allow the white list through.
      def match_params
        params.permit({selection: [:label, :value]}, :searchstring, {match: {}})
      end

  end
end


