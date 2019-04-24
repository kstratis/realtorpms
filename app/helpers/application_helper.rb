module ApplicationHelper

  CLASSNAME = {
      'active': 'has-active',
      'open': 'has-open',
  }
  # ACTIVE_CLASS = 'has-active'.freeze

  # Returns the full title on a per-page basis.
  def full_title(page_title = '')
    base_title = BRANDNAME
    if page_title.empty?
      base_title.capitalize
    else
      page_title + ' | ' + base_title.capitalize
    end
  end

  def active_for(options)
    names_of_controllers = Array.wrap(options.fetch(:controller) { nil })
    name_of_action     = options.fetch(:action) { nil }
    name_of_excepted_action = options.fetch(:except_action) { nil }
    request_path       = options.fetch(:path) { nil }
    request_class      = options.fetch(:classname) { 'active' }

    # puts '-----------'
    # puts request_path
    # puts request.path
    # puts "if equal will return #{CLASSNAME[request_class.to_sym]}"
    # puts '###########'
    # byebug
    # puts "the root path is: #{root_path}"

    return CLASSNAME[request_class.to_sym] if request_path && request_path == request.path

    if names_of_controllers && names_of_controllers.any? { |controller| controller == controller_name } && name_of_excepted_action != action_name
    # if name_of_controllers == controller_name && name_of_excepted_action != action_name
      CLASSNAME[request_class.to_sym] if name_of_action.nil? || (name_of_action == action_name)
    end
  end

  # +human_enum_name+ is defined in application_record from which all models inherit from as of Rails 5.
  # Here lies an alternative implementation just in case.
  # def human_enum_name(model, enum_name, enum_value )
  #   I18n.t("activerecord.attributes.#{model.model_name.i18n_key}.enums.#{enum_name.to_s}.#{enum_value}")
  # end

end