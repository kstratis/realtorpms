module Accounts
  class AssignmentsController < Accounts::BaseController
    before_action :authorize_owner_rest!

    # Calculates the diff between the existing and the requested assignments of a given property and applies it.
    def assign
      # Get the requested property
      property = Property.find(assignment_params[:pid])
      # Fetch its existing assignments
      existing_user_assignments = property.users.map(&:id)
      # Fetch the requested assignment from the user dropdown
      ru = assignment_params[:selection]
      # Normalize the data to an array
      requested_user_assignments = ru.map(&:to_h).map { |hash| hash['value'] }
      # The calculated user ids to be remove from the property
      remove_ids = existing_user_assignments - requested_user_assignments
      # The calculated user ids to be added to the property
      add_ids = requested_user_assignments - existing_user_assignments
      # Apply the modifications
      remove_ids.each {|id| Assignment.find_by(property_id: property, user_id: id).destroy} unless remove_ids.blank?
      add_ids.each {|id| property.users << User.find(id)} unless add_ids.blank?
      # Report back to the UI
      render json: {message: I18n.t('js.components.select.assign_completed')}, status: 200
    end

    private

      # Never trust parameters from the scary internet, only allow the white list through.
      def assignment_params
        params.permit(:pid, selection: [:label, :value], assignment: {})
      end

      def authorize_owner_rest!
        unless owner?
          respond_to do |format|
            format.json {render json: {message: 'Forbidden'}, status: 403 }
          end
        end
      end
  end
end


