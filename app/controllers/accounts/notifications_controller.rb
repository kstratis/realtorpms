module Accounts
  class NotificationsController < Accounts::BaseController
    before_action :account_user_notifications
    before_action :fetch_notification, only: [:read]

    attr_reader :account_user_notifications

    def index
      filter_notifications(account_user_notifications, current_user, params)
    end

    def mass_delete
      account_user_notifications.where(id: params[:selection]).destroy_all
      flash[:success] = I18n.t('clients.flash_delete_multiple')
      render :json => { :status => "OK", message: notifications_path }
    end

    def read
      @notification.update(read_at: Time.zone.now)
      filter_notifications(account_user_notifications.try(:reload), current_user, params)
    end

    private

    def account_user_notifications
      @account_user_notifications ||= current_account.notifications.where(recipient_id: current_user.id).newest_first
    end

    def fetch_notification
      @notification = account_user_notifications.find(params[:id])
    end
  end
end
