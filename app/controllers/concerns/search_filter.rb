module SearchFilter
  extend ActiveSupport::Concern
  # Invoke the model's search method and return a json response with the results (if any)
  #
  # @param object [Object] The class of the collection to search through
  # @param attributes [Hash] The data we want to retrieve
  # @param filter [Hash] A preset filter for any results
  # @param limit [Integer] Result count cap
  # @return [Hash] The search json response.
  def search (object, attributes, filter = {}, limit=nil)

    if params[:search].blank?
      return
    end

    # puts 'in search looking for filter'
    # puts filter
    # DEBUG
    puts "DEBUG: search term for #{object.name} is: #{params[:search]}"
    @results = object.search(params[:search].split(' ').map { |el| el.presence&.capitalize }.compact.join(' '), filter, limit)

    data = Array.new
    @results.each do |entry|
      hash = {
          value: entry.send(attributes.fetch(:value)),
          label: "#{entry.send(attributes.fetch(:label).fetch(0, ''))}#{attributes.fetch(:label).fetch(1, nil) ? ' - ' + entry.send(attributes.fetch(:label).fetch(1)).to_s : ''}"
      }
      data << hash
    end
    render :json => {:status => "OK", :message => data}

  end

end