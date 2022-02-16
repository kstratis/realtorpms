module Accounts
  class IlocationsController < Accounts::BaseController

    def new
      name = handle_prefilled_attrs
      attrs = { area: name.presence }
      @ilocation = current_account.ilocations.new(attrs)
      respond_to do |format|
        format.html
        format.json {
          render json: { message: render_to_string(partial: "/accounts/ilocations/form", formats: [:html]) }
        }
      end
    end

    def show
    end

    def create
      @ilocation = current_account.ilocations.new(ilocation_params)

      if @ilocation.save
        respond_to do |format|
          format.html do
            flash[:success] = I18n.t('activerecord.attributes.ilocation.flash_created')
            redirect_to @ilocation
          end
          # This responds to the inline form creation
          format.json {
            render json: { message: { label: @ilocation.area, value: @ilocation.id } }, status: :created
          }
        end
      else
        flash[:danger] = I18n.t('activerecord.attributes.ilocation.flash_not_created')
        render :new
      end
    end

    private

    def handle_prefilled_attrs
      return if params[:name].nil?

      params[:name]
    end

    def ilocation_params
      params.require(:ilocation).permit(:area)
    end
  end
end
