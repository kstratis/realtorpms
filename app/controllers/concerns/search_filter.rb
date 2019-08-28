module SearchFilter
  extend ActiveSupport::Concern

  def search (object, attributes, filter={})

    if params[:search].blank?
      return
    end

    # puts 'in search looking for filter'
    # puts filter
    # DEBUG
    # puts "search term is: #{params[:search]}"
    @results = object.search(params[:search], filter)

    data = Array.new
    @results.each do |entry|
      hash = {
          value: entry.send(attributes.fetch(:value)),
          label: "#{entry.send(attributes.fetch(:label)[0])} - #{entry.send(attributes.fetch(:label)[1])}"
      }
      data << hash
    end
    render :json => {:status => "OK", :message => data}

  end

end