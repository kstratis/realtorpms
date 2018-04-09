module LocationFilter
  def filter_locations
    # @locations = Location.all
    unless params[:search]
      return
    end
    puts params[:search]
    @locations = Location.search(params[:search])

  end

end