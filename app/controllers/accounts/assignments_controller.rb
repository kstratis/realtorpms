module Accounts
  class AssignmentsController < Accounts::BaseController
    include AddRemoveAssociationsHandler

    before_action :authorize_owner_rest!

    # Calculates the diff between the existing and the requested assignments of a given property and applies it.
    def assign
      # Get the requested property
      property = current_account.properties.find(assignment_params[:pid])
      data = associations_handler(property, 'users', assignment_params[:selection])
      render :json => {:status => 200, :message => data, meta: I18n.t('js.components.select.assign_completed')} and return
    end

    def assigned
      property = current_account.properties.find(assignment_params[:pid])
      data = property.users.blank? ? nil : property.users.map { |user| {label: "#{user.first_name} #{user.last_name}", value: user.id} }
      render json: {status: "OK", message: data}
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


