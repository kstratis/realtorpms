 module LocationFilter
  def filter_locations
    # @locations = Location.all

    if params[:search].blank?
      return
    end

    puts "search term is: #{params[:search]}"
    @locations = Location.search(params[:search])
    # respond_to do |format|
    #   format.json {render json: {message: 'Working! OK!'}, status: 200}
    # end
    # puts @locations
    # [
    #  *      { value: 'one', label: 'One' },
    #  *      { value: 'two', label: 'Two' }
    #  *   ]
    data = {:dataset => Array.new}

    @locations.each do |entry|
      puts "#{entry.localname} - #{entry.parent_localname}"
      hash = {
          value: entry.id,
          label: "#{entry.localname} - #{entry.parent_localname}"
      }
      data[:dataset] << hash
    end

    respond_to do |format|
      format.html
      format.json {render json: { data: data, status: 200} }
    end

  end

end