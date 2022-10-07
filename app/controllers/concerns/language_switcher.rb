module LanguageSwitcher
  extend ActiveSupport::Concern

  def greek_user?
    (@client_country == 'GR') || Rails.env.development?
  end

  def international_user?
    @client_country != 'GR'
  end

  def locale_switch_dismissed
    @locale_switch_dismissed = request.cookies['locale_switch_dismissed'].presence
  end

  def client_country
    @client_country = Geocoder.search(request.remote_ip).first&.country
    # DEBUG
    # @client_country = Geocoder.search('162.125.248.18').first&.country # US-based IP
    # @client_country = Geocoder.search('103.187.242.0').first&.country  # Greek-based IP
  end
end