module LandlordFilter
  extend ActiveSupport::Concern

  def filter_landlords

    if params[:search].blank?
      return
    end

    @landlords = current_account.landlords.search(params[:search])

    data = Array.new
    @landlords.each do |entry|
      hash = {
          value: entry.id,
          label: "#{entry.first_name} #{entry.last_name}"
      }
      data << hash
    end

    render :json => {:status => "OK", :message => data}

  end

end