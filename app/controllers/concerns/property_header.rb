module PropertyHeader
  extend ActiveSupport::Concern

  # Πώληση, Διαμέρισμα 54 τ.μ., Άνω Πατήσια, Κέντρο Αθήνας, € 64.000
  # Πώληση, Διαμέρισμα, 85 τ.μ., Λαμπρινή, 220.000 €
  def heading(property)
    businesstype = t("activerecord.attributes.property.enums.businesstype.#{property.businesstype}")
    category = t("activerecord.attributes.property.enums.subcategory.#{property.category.slug}")
    size = property.size ? t("activerecord.attributes.property.size_meter_html", size: property.size.to_s) : nil
    localname = property.location.localname
    parent_localname = property.location.parent_localname
    price = property.price ? ActionController::Base.helpers.number_to_currency(property.price) : nil
    [businesstype, "#{category} #{size}", localname, parent_localname, price].compact.map(&:strip).join(', ')
  end

  def mini_heading(property)
    category = t("activerecord.attributes.property.enums.subcategory.#{property.category.slug}")
    size = property.size ? t("activerecord.attributes.property.size_meter_html", size: property.size.to_s) : nil
    "#{category} #{size}"
  end

end