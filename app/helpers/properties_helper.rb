module PropertiesHelper
  def get_options
    options = {}
    Category.where(id: (5..32).to_a).each do |entry|
      if options.key?(entry[:parent_slug])
        options[entry[:parent_slug]][:subcategory] << { entry[:slug] => t("activerecord.attributes.property.enums.subcategory.#{entry[:slug].to_s}") }
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

  def property_categories
    Property.categories.keys.collect {|businesstype| {label: Property.human_enum_name(:businesstype, businesstype), value: businesstype}}
  end

  def property_subcategories(category)
    Property.subcategories.keys.collect {|businesstype| {label: Property.human_enum_name(:businesstype, businesstype), value: businesstype}}
  end

  def render_attribute(property, attribute, opts=nil, renderfn=nil)
    puts "checking attribute: #{attribute} and options: #{opts}"
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

