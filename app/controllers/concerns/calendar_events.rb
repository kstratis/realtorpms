module CalendarEvents
  extend ActiveSupport::Concern

  def calendar_events_data(user, date)
    date = Date.parse(date)
    events = user.calendar_events.with_year_and_month(date.year, date.month)
    result = events.each_with_object({}) do |event, hash|
      hash[event.created_for.to_date] ||= []
      event.path = calendar_event_path(event)
      hash[event.created_for.to_date] << event
      hash
    end
    result.sort_by { |k, _| k }.to_h
  end
end
