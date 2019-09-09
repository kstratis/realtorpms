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
          label: "#{entry.send(attributes.fetch(:label).fetch(0, nil))}#{attributes.fetch(:label).fetch(1, nil) ? ' - ' + entry.send(attributes.fetch(:label).fetch(1)) : nil}"
      }
      data << hash
    end
    # puts data
    render :json => {:status => "OK", :message => data}

  end

end