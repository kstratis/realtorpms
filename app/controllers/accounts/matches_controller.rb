module Accounts
  class MatchesController < Accounts::BaseController
    before_action :authorize_owner_rest!

    # Calculates the diff between the existing and the requested assignments of a given property and applies it.
    def assign

      puts 'GOT YA'
      puts params[:selection]

      # requested_client = matchmaking_params[:selection][:value]
      # puts requested_client.inspect












      # Get the requested client
      # client = current_account.clients.find(matchmaking_params[:cid])
      # # Fetch its existing assignments
      # existing_user_clientships = client.users.map(&:id)
      # # Fetch the requested assignment from the user dropdown
      # ru = matchmaking_params[:selection]
      # # Normalize the data to an array
      # requested_user_clientships = ru.map(&:to_h).map { |hash| hash['value'] }
      # # The calculated user ids to be remove from the property
      # remove_ids = existing_user_clientships - requested_user_clientships
      # # The calculated user ids to be added to the property
      # add_ids = requested_user_clientships - existing_user_clientships
      # # Apply the modifications
      # remove_ids.each { |id| Clientship.find_by(client_id: client, user_id: id).destroy } unless remove_ids.blank?
      # add_ids.each { |id| client.users << current_account.users.find(id) } unless add_ids.blank?
      # # Report back to the UI
      # client.reload # Reload or we'll get stale entries
      client = Client.find(2)
      data = Array.new
      client.users.each do |entry|
        hash = {
            label: "#{entry.first_name} #{entry.last_name}",
            value: entry.id
        }
        data << hash
      end
      render :json => {:status => 200, :message => data, meta: I18n.t('js.components.select.assign_completed')} and return
    end

    private

    # Never trust parameters from the scary internet, only allow the white list through.
    def matchmaking_params
      params.permit(selection: [:label, :value], match: {})
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


