module PropertiesHelper
  def dependant_options
    options = {}
    Category.all.each do |entry|
      options.key?(entry[:parent_name]) ? options[entry[:parent_name]] << entry[:name] : options[entry[:parent_name]] = [entry[:name]]
    end
    options
  end
end
