module SizeConverter
  extend ActiveSupport::Concern

  def print_size(property_size, account)
    return if property_size.blank?

    if account.greek?
      I18n.t("activerecord.attributes.property.size_meter_html", size: ActionController::Base.helpers.number_with_delimiter(property_size))
    else
      I18n.t("activerecord.attributes.property.size_feet_html", size: ActionController::Base.helpers.number_with_delimiter(property_size))
    end
  end

  def print_price_per_size(property_pricepersize, account)
    return if property_pricepersize.blank?

    if account.greek?
      I18n.t("activerecord.attributes.property.price_per_sqmeter_html",
             price: ActionController::Base.helpers.number_to_currency(property_pricepersize, precision: 0, round_mode: :up))
    else
      I18n.t("activerecord.attributes.property.price_per_sqfoot_html",
             price: ActionController::Base.helpers.number_to_currency(property_pricepersize, precision: 0, round_mode: :up))
    end
  end

  def print_price(property_price, account)
    return if property_price.blank?

    if account.greek?
      ActionController::Base.helpers.number_to_currency(property_price, locale: :el, precision: 0, round_mode: :up)
    else
      ActionController::Base.helpers.number_to_currency(property_price, locale: :en, precision: 0, round_mode: :up)
    end
  end
end
