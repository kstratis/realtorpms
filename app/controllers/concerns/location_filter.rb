module LocationFilter
  extend ActiveSupport::Concern

  def filter_locations

    if params[:search].blank?
      return
    end

    # DEBUG
    # puts "search term is: #{params[:search]}"
    @locations = Location.search(params[:search])

    data = Array.new
    @locations.each do |entry|
      hash = {
          value: entry.id,
          label: "#{entry.localname} - #{entry.parent_localname}"
      }
      data << hash
    end
    render :json => {:status => "OK", :message => data}

  end

end