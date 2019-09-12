module LocationFinder
  extend ActiveSupport::Concern

  def get_initial_locations(locations)
    # puts 'DEBUG'
    # puts locations
    locations.map do |location|
      l = Location.find(location)
      {label: "#{l.localname}#{l.parent_localname ? ' - ' + l.parent_localname : nil}", value: l.id}
    end
  end
end
