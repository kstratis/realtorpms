module LocationFinder
  extend ActiveSupport::Concern

  def parse_initial_locations(locations_hash)
    location_klass = locations_hash[:label].classify.safe_constantize
    locations = location_klass.where(id: parse_location_ids(locations_hash))
    locations.map do |location|
      if locations_hash[:label] == 'ilocations'
        { label: location.area, value: location.id }
      else
        { label: "#{location.localname}#{location.parent_localname ? ' - ' + location.parent_localname : nil}",
          value: location.id }
      end
    end
  end

  def parse_location_ids(locations_hash)
    return [] if locations_hash[:value].blank?

    locations_hash[:value].split(",").map { |loc| loc.split(':').first }
  end
end
