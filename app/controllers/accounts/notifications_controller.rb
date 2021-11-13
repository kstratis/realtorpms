module Accounts
  class NotificationsController < Accounts::BaseController
    before_action :fetch_notification, only: [:read]

    def index
      filter_notifications(current_user.notifications.newest_first, current_user, params)
    end

    def mass_delete
      current_user.notifications.where(id: params[:selection]).destroy_all
      flash[:success] = I18n.t('clients.flash_delete_multiple')
      render :json => { :status => "OK", message: notifications_path }
    end

    def read
      @notification.update(read_at: Time.zone.now)
      filter_notifications(current_user.notifications.newest_first, current_user, params)
    end

    private

    def fetch_notification
      @notification = Notification.find(params[:id])
    end
  end
end
