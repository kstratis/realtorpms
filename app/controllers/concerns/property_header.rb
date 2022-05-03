module PropertyHeader
  extend ActiveSupport::Concern

  # Πώληση, Διαμέρισμα 54 τ.μ., Άνω Πατήσια, Κέντρο Αθήνας, € 64.000
  # Πώληση, Διαμέρισμα, 85 τ.μ., Λαμπρινή, 220.000 €
  def heading(property)
    property_account = property.account
    businesstype = if property_account.greek?
                     t("activerecord.attributes.property.enums.businesstype.#{property.businesstype}_banner")
                   else
                     t("activerecord.attributes.property.enums.businesstype.#{property.businesstype}_heading")
                   end
    category = t("activerecord.attributes.property.enums.subcategory.#{property.category.slug}")
    size = print_size(property.size, property_account)
    price = property.price ? ActionController::Base.helpers.number_to_currency(property.price, precision: 0, round_mode: :up) : nil
    [businesstype, "#{category} #{size}", retrieve_location(property), price].compact.map(&:strip).join(', ')
  end

  def mini_heading(property, account)
    category = t("activerecord.attributes.property.enums.subcategory.#{property.category.slug}")
    size = print_size(property.size, account)
    "#{category} #{size}"
  end

  private

  def retrieve_location(property)
    if property.location.present?
      "#{property.location.localname} #{property.location.parent_localname}"
    else
      property.ilocation.area
    end
  end
end