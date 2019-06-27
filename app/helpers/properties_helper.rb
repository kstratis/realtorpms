module PropertiesHelper
  def get_options
    options = {}
    Category.all.each do |entry|
      if options.key?(entry[:parent_name])
        options[entry[:parent_name]][:subcategory] << { entry[:name] => t("activerecord.attributes.property.enums.subcategory.#{entry[:name].to_s}") }
      else
        options[entry[:parent_name]] = {
            :category => {entry[:parent_name] => t("activerecord.attributes.property.enums.category.#{entry[:parent_name].to_s}")},
            :subcategory => [{entry[:name] => t("activerecord.attributes.property.enums.subcategory.#{entry[:name].to_s}")}]
        }
      end
    end
    options
    # pp options
  end

  # Πώληση, Διαμέρισμα 54 τ.μ., Άνω Πατήσια, Κέντρο Αθήνας, € 64.000
  # Πώληση, Διαμέρισμα, 85 τ.μ., Λαμπρινή, 220.000 €
  def heading
    businesstype = t("activerecord.attributes.property.enums.businesstype.#{@property.businesstype}")
    category = t("activerecord.attributes.property.enums.subcategory.#{@property.subcategory}")
    size = @property.size ? t("activerecord.attributes.property.size_meter_html", size: @property.size.to_s) : nil
    localname = @property.location.localname
    parent_localname = @property.location.parent_localname
    price = @property.price ? number_to_currency(@property.price) : nil
    [businesstype, "#{category} #{size}", localname, parent_localname, price].join(', ')
  end

  def render_attribute(property, attribute, opts=nil, renderfn=nil)
    if property.respond_to?(attribute)
      result = (opts ? property.send(attribute, opts) : property.send(attribute)) || false
      return renderfn.call(result) if renderfn
      result
    else
      raise "Internal Error"
    end
  end

  # Renders a +dependant+ extra field. Extra fields are stored directly on the property model.
  # i.e. If a property is found to have a 'garden' through the extras table, we then check property.garden_space for a
  # value on the property instance and return it. Otherwise we return nil
  def render_extra_value(property, attribute)
    if property.respond_to?(attribute)
      value = property.send(attribute)
      value.blank? ? nil : ": <span class='badge badge-light'>#{value} #{I18n.t('sq_meters_html')}</span>"
    end
  end

end

