module ApplicationHelper

  CLASSNAME = {
      'active': 'has-active',
      'hasopen': 'has-open',
  }
  # ACTIVE_CLASS = 'has-active'.freeze

  # Returns the full title on a per-page basis.
  def full_title(page_title = '')
    base_title = 'Landia Main'
    if page_title.empty?
      base_title
    else
      page_title + ' | ' + base_title
    end
  end

  def active_for(options, name='active')
    name_of_controller = options.fetch(:controller) { nil }
    name_of_action     = options.fetch(:action) { nil }
    request_path       = options.fetch(:path) { nil }

    puts '-----------'
    puts request_path
    puts request.path
    puts "if equal will return #{CLASSNAME[name.to_sym]}"
    puts '###########'


    return CLASSNAME[name.to_sym] if request_path && request_path == request.path

    if name_of_controller == controller_name
      CLASSNAME[name.to_sym] if name_of_action.nil? || (name_of_action == action_name)
    end
  end

  # +human_enum_name+ is defined in application_record from which all models inherit from as of Rails 5.
  # Here lies an alternative implementation just in case.
  # def human_enum_name(model, enum_name, enum_value )
  #   I18n.t("activerecord.attributes.#{model.model_name.i18n_key}.enums.#{enum_name.to_s}.#{enum_value}")
  # end

end