module Accounts
  class MatchesController < Accounts::BaseController

    # Saves the search preferences of a client
    def assign

      requested_search = match_params[:searchstring]

      # If new user is created on the select box
      if match_params[:selection].key?(:__isNew__)
        name = match_params[:selection][:label].split(/\.?\s+/)
        if current_user.is_admin?(current_account)
          @client = current_account.clients.new(first_name: name.first, last_name: name.last, searchprefs: requested_search)
        else
          @client = current_account.clients.new(first_name: name.first, last_name: name.last, searchprefs: requested_search)
          current_user.clients << @client
        end
        if @client.save
          render json: {status: 200, message: client_url(@client)} and return
        end
      end

      # Otherwise if existing user is requested
      if current_user.is_admin?(current_account)
        @requested_client = current_account.clients.find(match_params[:selection][:value])
      else
        @requested_client = current_user.clients.find(match_params[:selection][:value])
      end
      # requested_search = match_params[:searchstring]
      @requested_client.searchprefs = requested_search
      if @requested_client.save
        render json: {status: 200, message: client_url(@requested_client)}
      end
    end

    private
      # Never trust parameters from the scary internet, only allow the white list through.
      def match_params
        params.permit({selection: [:label, :value, :__isNew__]}, :searchstring, {match: {}})
      end

  end
end


