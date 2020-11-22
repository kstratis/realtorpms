module Accounts
  class AssignmentsController < Accounts::BaseController
    include AddRemoveAssociationsHandler

    before_action :admin_access_ajax
    before_action :set_modal_seed, only: [:properties_modal_listing]

    # This action assigns or removes users (partners) from a given property.
    # It does so by calculating the diff between the existing and the requested properties.
    # Only applies to **dropdown components (react-select)**
    # POST '/assignments/property/:pid/users/'
    def assign
      # Get the requested property
      property = current_account.properties.find(assignment_params[:pid])
      data = associations_handler(property, 'users', assignment_params[:selection])

      render json: { status: 200, message: data, meta: I18n.t('js.components.select.assign_completed') } and return
    end

    # Preselects all users assigned on a particular property within the react-select component
    # Only applies to dropdown components
    # GET '/assignments/property/:pid/users/'
    def assigned
      property = current_account.properties.find(assignment_params[:pid])
      data = property.users.blank? ? nil : property.users.map { |user| { label: "#{user.first_name} #{user.last_name}", value: user.id } }
      render json: { status: "OK", message: data }
    end

    # -------------------------------------------------------------

    # Preselects all users assigned on a particular property within the react-select component
    def properties_modal_listing
      if params[:search].present?
        @properties = @properties.search(params[:search])
      end
      render json: { status: 200, message: format_data(assignment_params[:uid].presence, params[:page].presence || 1),
                     meta: I18n.t('users.show.modal.assignments_next') } and return
    end

    # This is used from the assignments modal under `/users/:id`
    def properties_modal_assign
      property_id = params[:pid]
      user = current_account.users.find(assignment_params[:uid])

      if user.properties.map(&:id).include?(property_id)
        user.properties.delete(property_id)
      else
        user.properties << current_account.properties.find(property_id)
      end

      set_modal_seed
      properties_modal_listing
    end

    private

    def set_modal_seed
      @properties = current_account.properties.order(created_at: 'desc')
    end

    def format_data(uid, page)
      results_per_page = 6

      user = current_account.users.find(uid)
      # properties = current_account.properties.order(created_at: 'desc')
      properties = @properties.paginate(page: page, per_page: results_per_page)
      data = {}

      data['payload'] = properties.map do |property|
        { label: property.dropdown_description,
          slug: property.slug,
          id: property.id,
          already_assigned_to_user: user.properties.include?(property) }
      end

      data['extra'] = {
        total_entries: properties.total_entries,
        current_page: properties.current_page,
        results_per_page: results_per_page
      }

      data
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def assignment_params
      params.permit(:pid, :uid, :page, :search, selection: [:label, :value], assignment: {})
    end

  end
end


