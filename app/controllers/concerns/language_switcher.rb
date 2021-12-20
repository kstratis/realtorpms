module LanguageSwitcher
  extend ActiveSupport::Concern

  def greek_user?
    @client_country == 'GR' || Rails.env.development?
  end

  def locale_switch_dismissed
    @locale_switch_dismissed = request.cookies['locale_switch_dismissed'].presence
  end

  def client_country
    @client_country = Geocoder.search(request.remote_ip).first.country
  end
end