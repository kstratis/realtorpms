module PropertiesHelper
  def category_options
    options = {}
    Category.where(id: (5..32).to_a).each do |entry|
      if options.key?(entry[:parent_slug])
        options[entry[:parent_slug]][:subcategory] << {entry[:slug] => t("activerecord.attributes.property.enums.subcategory.#{entry[:slug].to_s}")}
      else
        options[entry[:parent_slug]] = {
            :category => {entry[:parent_slug] => t("activerecord.attributes.property.enums.category.#{entry[:parent_slug].to_s}")},
            :subcategory => [{entry[:slug] => t("activerecord.attributes.property.enums.subcategory.#{entry[:slug].to_s}")}]
        }
      end
    end
    pp options
    options
  end

  def price_options
    options = {
        'sell'=> {
            category: {'sell' => 'sell'},
            subcategory: [
                {'0': t("activerecord.attributes.property.enums.price.all")},
                {'50000'=> number_to_currency(50000)},
                {'75000'=> number_to_currency(75000)},
                {'100000'=> number_to_currency(100000)},
                {'150000'=> number_to_currency(150000)},
                {'200000'=> number_to_currency(200000)},
                {'250000'=> number_to_currency(250000)},
                {'300000'=> number_to_currency(300000)},
                {'350000'=> number_to_currency(350000)},
                {'400000'=> number_to_currency(400000)},
                {'500000'=> number_to_currency(500000)},
                {'750000'=> number_to_currency(750000)},
                {'1000000'=> number_to_currency(1000000)}
            ]},
        'rent' => {
            category: {'rent' => 'rent'},
            subcategory: [
                {'0': t("activerecord.attributes.property.enums.price.all")},
                {'150'=> number_to_currency(150)},
                {'200'=> number_to_currency(200)},
                {'300'=> number_to_currency(300)},
                {'500'=> number_to_currency(500)},
                {'750'=> number_to_currency(750)},
                {'1000'=> number_to_currency(1000)},
                {'1300'=> number_to_currency(1300)},
                {'1600'=> number_to_currency(1600)},
                {'2000'=> number_to_currency(2000)},
                {'2500'=> number_to_currency(2500)},
                {'3000'=> number_to_currency(3000)}]
        }
    }
    pp options
    options
  end

  def property_categories
    Property.categories.keys.collect { |businesstype| {label: Property.human_enum_name(:businesstype, businesstype), value: businesstype} }
  end

  def property_subcategories(category)
    Property.subcategories.keys.collect { |businesstype| {label: Property.human_enum_name(:businesstype, businesstype), value: businesstype} }
  end

  def render_attribute(property, attribute, opts = nil, renderfn = nil)
    if property.respond_to?(attribute)
      result = (opts ? property.send(attribute, opts) : property.send(attribute)) || false
      return renderfn.call(result).to_s.html_safe if renderfn
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

