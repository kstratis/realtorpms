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
    # DEBUG
    pp options
    options
  end

  def price_options
    options = {
        'sell'=> {
            category: {'sell' => 'sell'},
            subcategory: [
                # {'0': t("activerecord.attributes.property.enums.price.all")},
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
                # {'0': t("activerecord.attributes.property.enums.price.all")},
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
    # DEBUG
    # pp options
    options
  end

  def size_options
    options = {
        'building'=> {
            category: {'building' => 'building'},
            subcategory: [
                {'50'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 50.to_s)},
                {'60'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 60.to_s)},
                {'70'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 70.to_s)},
                {'85'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 85.to_s)},
                {'100'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 100.to_s)},
                {'120'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 120.to_s)},
                {'150'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 150.to_s)},
                {'200'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 200.to_s)},
                {'250'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 250.to_s)},
                {'300'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 300.to_s)},
                {'400'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 400.to_s)},
                {'500'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 500.to_s)}
            ]},
        'land' => {
            category: {'land' => 'land'},
            subcategory: [
                {'200'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 200.to_s)},
                {'300'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 300.to_s)},
                {'400'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 400.to_s)},
                {'500'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 500.to_s)},
                {'750'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 750.to_s)},
                {'1000'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 1000.to_s)},
                {'1500'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 1500.to_s)},
                {'2000'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 2000.to_s)},
                {'3000'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 3000.to_s)},
                {'5000'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 5000.to_s)},
                {'7500'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 7500.to_s)},
                {'10000'=> I18n.t('activerecord.attributes.property.size_meter_html', size: 10000.to_s)},
            ]
        }
    }
    # DEBUG
    # pp options
    options
  end

  def rooms_options
    options = {
        'building'=> {
            category: {'building' => 'building'},
            subcategory: [
                {'1'=> "1"},
                {'2'=> "2"},
                {'3'=> "3"},
                {'4'=> "4"},
                {'5'=> "5"},
                {'6'=> "6"},
                {'7'=> "7"},
                {'8'=> "8"},
                {'9'=> "9"},
                {'10'=> "10"}
            ]},
        'land' => {
            category: {'land' => 'land'},
            subcategory: []
        }
    }
    options
  end

  def floors_options
    options = {
        'building'=> {
            category: {'building' => 'building'},
            subcategory: [
                {'0' => I18n.t("activerecord.attributes.property.enums.floor.basement")},
                {'1' => I18n.t("activerecord.attributes.property.enums.floor.semi_basement")},
                {'2' => I18n.t("activerecord.attributes.property.enums.floor.ground_floor")},
                {'3' => I18n.t("activerecord.attributes.property.enums.floor.mezzanine")},
                {'4' => I18n.t("activerecord.attributes.property.enums.floor.1")},
                {'5' => I18n.t("activerecord.attributes.property.enums.floor.2")},
                {'6' => I18n.t("activerecord.attributes.property.enums.floor.3")},
                {'7' => I18n.t("activerecord.attributes.property.enums.floor.4")},
                {'8' => I18n.t("activerecord.attributes.property.enums.floor.5")},
                {'9' => I18n.t("activerecord.attributes.property.enums.floor.6")},
                {'10' => I18n.t("activerecord.attributes.property.enums.floor.7")},
                {'11'=> I18n.t("activerecord.attributes.property.enums.floor.8")},
                {'12'=> I18n.t("activerecord.attributes.property.enums.floor.9")},
                {'13'=> I18n.t("activerecord.attributes.property.enums.floor.10")},
                {'14'=> I18n.t("activerecord.attributes.property.enums.floor.11")},
                {'15'=> I18n.t("activerecord.attributes.property.enums.floor.12")},
                {'16'=> I18n.t("activerecord.attributes.property.enums.floor.13")},
                {'17'=> I18n.t("activerecord.attributes.property.enums.floor.14")},
                {'18'=> I18n.t("activerecord.attributes.property.enums.floor.15")},
                {'19'=> I18n.t("activerecord.attributes.property.enums.floor.16")},
                {'20'=> I18n.t("activerecord.attributes.property.enums.floor.17")},
                {'21'=> I18n.t("activerecord.attributes.property.enums.floor.18")},
                {'22'=> I18n.t("activerecord.attributes.property.enums.floor.19")},
                {'23'=> I18n.t("activerecord.attributes.property.enums.floor.20")},
                {'24'=> I18n.t("activerecord.attributes.property.enums.floor.21")},
                {'25'=> I18n.t("activerecord.attributes.property.enums.floor.22")},
                {'26'=> I18n.t("activerecord.attributes.property.enums.floor.23")},
                {'27'=> I18n.t("activerecord.attributes.property.enums.floor.24")},
                {'28'=> I18n.t("activerecord.attributes.property.enums.floor.25")},
                {'29'=> I18n.t("activerecord.attributes.property.enums.floor.26")},
                {'30'=> I18n.t("activerecord.attributes.property.enums.floor.27")},
                {'31'=> I18n.t("activerecord.attributes.property.enums.floor.28")},
                {'32'=> I18n.t("activerecord.attributes.property.enums.floor.29")},
                {'33'=> I18n.t("activerecord.attributes.property.enums.floor.30")},
                {'34'=> I18n.t("activerecord.attributes.property.enums.floor.31")},
                {'35'=> I18n.t("activerecord.attributes.property.enums.floor.32")},
                {'36'=> I18n.t("activerecord.attributes.property.enums.floor.33")},
                {'37'=> I18n.t("activerecord.attributes.property.enums.floor.34")},
                {'38'=> I18n.t("activerecord.attributes.property.enums.floor.35")},
                {'39'=> I18n.t("activerecord.attributes.property.enums.floor.36")},
                {'40'=> I18n.t("activerecord.attributes.property.enums.floor.37")},
                {'41'=> I18n.t("activerecord.attributes.property.enums.floor.38")},
                {'42'=> I18n.t("activerecord.attributes.property.enums.floor.39")},
                {'43'=> I18n.t("activerecord.attributes.property.enums.floor.40")},
                {'44'=> I18n.t("activerecord.attributes.property.enums.floor.41")},
                {'45'=> I18n.t("activerecord.attributes.property.enums.floor.42")},
                {'46'=> I18n.t("activerecord.attributes.property.enums.floor.43")},
                {'47'=> I18n.t("activerecord.attributes.property.enums.floor.44")},
                {'48'=> I18n.t("activerecord.attributes.property.enums.floor.45")},
                {'49'=> I18n.t("activerecord.attributes.property.enums.floor.46")},
                {'50'=> I18n.t("activerecord.attributes.property.enums.floor.47")},
                {'51'=> I18n.t("activerecord.attributes.property.enums.floor.48")},
                {'52'=> I18n.t("activerecord.attributes.property.enums.floor.49")},
                {'53'=> I18n.t("activerecord.attributes.property.enums.floor.50")},
            ]},
        'land' => {
            category: {'land' => 'land'},
            subcategory: []
        }
    }
    options
  end

  def construction_options
    options = {
        'building'=> {
            category: {'building' => 'building'},
            subcategory: (1940..Time.zone.now.year + 2).collect {|year| {year.to_s => year.to_s}},
            },
        'land' => {
            category: {'land' => 'land'},
            subcategory: []
        }
    }
    options
  end

  def retrieve_stored_floor_option(floor)
    case floor.to_s
    when '0'
      {label: I18n.t("activerecord.attributes.property.enums.floor.basement"), value: 0.to_s}
    when '1'
      {label: I18n.t("activerecord.attributes.property.enums.floor.semi_basement"), value: floor.to_s}
    when '2'
      {label: I18n.t("activerecord.attributes.property.enums.floor.ground_floor"), value: floor.to_s}
    when '3'
      {label: I18n.t("activerecord.attributes.property.enums.floor.mezzanine"), value: floor.to_s}
    else
      {label: I18n.t("activerecord.attributes.property.enums.floor.#{(floor.to_i - 3).to_s}"), value: floor.to_s}
    end
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

