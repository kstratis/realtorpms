module PropertiesHelper
  def get_options
    options = {}
    Category.all.each do |entry|
      if options.key?(entry[:parent_name])
        options[entry[:parent_name]][:subcategory] << { entry[:name] => t("activerecord.attributes.property.enums.#{entry[:parent_name].to_s}.#{entry[:name].to_s}") }
      else
        options[entry[:parent_name]] = {
            :category => {entry[:parent_name] => t("activerecord.attributes.property.enums.category.#{entry[:parent_name].to_s}")},
            :subcategory => [{entry[:name] => t("activerecord.attributes.property.enums.#{entry[:parent_name].to_s}.#{entry[:name].to_s}")}]
        }
      end
    end
    options
    # pp options
  end
end

