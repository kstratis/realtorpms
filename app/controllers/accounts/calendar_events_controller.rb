module Accounts
  class CalendarEventsController < Accounts::BaseController
    before_action :date, only: [:index]

    def create
      @event = CalendarEvent.new(calendar_params)
      @event.user = current_user
      if @event.save  # model_type is automatically saved within a before_validation hook inside the model
        @event.path = calendar_event_path(@event)
        respond_to do |format|
          format.json { render json: { status: "OK", message: @event } }
        end
      else
        puts @event.errors.inspect
        # flash[:danger] = I18n.t('clients.flash_not_created')
        # render :new
      end
    end

    def index
      return if @date.blank?

      events = calendar_events_data(current_user, @date)
      respond_to do |format|
        format.json { render json: { status: "OK", message: events } }
      end
    end

    def show
    end

    def destroy
      event = params[:id]

      CalendarEvent.find(event).destroy!

      respond_to do |format|
        format.json { render json: { status: "OK", message: '' } }
      end

    end

    private

    def calendar_params
      params.require(:calendar_event).permit(:description, :created_for, :id, :scope, :path)
    end

    def date
      @date = params[:date]
      @scope = params[:scope]
    end
  end
end
