module OwnerFilter
  def filter_owners
    # @locations = Location.all

    if params[:search].blank?
      return
    end

    puts "search term is: #{params[:search]}"
    @owners = Owner.search(params[:search])
    # respond_to do |format|
    #   format.json {render json: {message: 'Working! OK!'}, status: 200}
    # end
    # puts @locations
    # [
    #  *      { value: 'one', label: 'One' },
    #  *      { value: 'two', label: 'Two' }
    #  *   ]
    data = {:dataset => Array.new}

    @owners.each do |entry|
      puts "#{entry.first_name} #{entry.last_name}"
      hash = {
          value: entry.id,
          label: "#{entry.first_name} #{entry.last_name}"
      }
      data[:dataset] << hash
    end

    respond_to do |format|
      format.html
      format.json {render json: { data: data, status: 200} }
    end

  end

end