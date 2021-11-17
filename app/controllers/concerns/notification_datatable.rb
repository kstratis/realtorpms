module NotificationDatatable
  extend ActiveSupport::Concern
  include Utilities

  def filter_notifications(relation, user, filters = {})
    if filters[:page]
      param = Integer(filters[:page]) rescue nil
      unless param.is_a? Integer
        render_404 and return
      end
    end

    @notifications = relation

    @notifications = @notifications.paginate(page: filters[:page], :per_page => 10)
    # @persons = User.paginate(page: filters[:page], :per_page => 10)
    @notificationslist = {:dataset => Array.new}

    @notifications.each do |entry|
      hash = {
        id: entry.id,
        message: entry.params,
        read_at: entry.read_at,
        read_path: read_notification_path(entry),
        created_at: l(entry.created_at, format: :custom)
      }
      @notificationslist[:dataset] << hash
    end
    # The following entries are only for the first render
    @unread_notifications_count = user&.notifications&.unread&.size || 0
    @total_entries = @notifications.total_entries
    @current_page = @notifications.current_page
    @results_per_page = 10

    respond_to do |format|
      format.html
      format.json {render json: {results_per_page: @results_per_page,
                                 datalist: @notificationslist,
                                 total_entries: @notifications.total_entries,
                                 current_page: @notifications.current_page,
                                 unread_notifications_count: @unread_notifications_count}, status: 200}
    end
  end
end