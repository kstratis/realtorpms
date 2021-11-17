module ApplicationHelper
  include Pagy::Frontend

  CLASSNAME = {
      'active': 'has-active',
      'open': 'has-open',
  }

  # Returns the full title on a per-page basis.
  def full_title(page_title = '')
    base_title = BRANDNAME
    if page_title.empty?
      base_title
    else
      page_title + ' | ' + base_title
    end
  end

  # Returns the has-active or has-open HTML class names according to navigation
  def active_for(options)
    names_of_controllers = Array.wrap(options.fetch(:controller) { nil })
    name_of_action     = options.fetch(:action) { nil }
    name_of_excepted_action = options.fetch(:except_action) { nil }
    request_path       = options.fetch(:path) { nil }
    request_class      = options.fetch(:classname) { 'active' }

    return CLASSNAME[request_class.to_sym] if request_path && request_path == request.path

    if names_of_controllers && names_of_controllers.any? { |controller| controller == controller_name } && name_of_excepted_action != action_name
      CLASSNAME[request_class.to_sym] if name_of_action.nil? || (name_of_action == action_name)
    end
  end

  def link_to_add_fields(name, f, association, prefix='', vgroup=nil, classnames='')
    new_object = f.object.send(association).klass.new
    id = new_object.object_id
    fields = f.fields_for(association, new_object, child_index: id) do |builder|
      render(prefix + association.to_s.singularize + "_fields", f: builder, vgroup: vgroup.blank? ? nil : vgroup)
    end
    link_to(name, '#', class: "btn btn-outline-danger add_fields #{classnames}", data: {id: id, fields: fields.gsub("\n", "")})
  end

  def version
    if Rails.env.development?
      `git rev-parse --short HEAD`
    else
      Rails.cache.fetch(:version, expires_in: 10.minutes) do
        File.read(Rails.root.join("REVISION")).first(8)
      end
    end
  end

  # +human_enum_name+ is defined in application_record from which all models inherit from as of Rails 5.
  # Here lies an alternative implementation just in case.
  # def human_enum_name(model, enum_name, enum_value )
  #   I18n.t("activerecord.attributes.#{model.model_name.i18n_key}.enums.#{enum_name.to_s}.#{enum_value}")
  # end

  def chart_data?(graph)
    !graph[:datasets].first[:data].inject(0, :+).zero?
  end

  def next_month_name
    date = Time.zone.now.end_of_month + 1.day
    I18n.t('date.month_names_gen')[date.month - 1]
  end

  def language_switcher
    if I18n.locale == 'en'
      content_tag :i, nil, class: 'fas fa-user fa-fw'
      "#{content_tag(:span, 'EN')} | #{link_to('ΕΛ', landing_root_url(locale: 'el'), class: '')}"
    else
      "#{content_tag(:span, 'ΕΛ')} | #{link_to('EN', landing_root_url(locale: 'en'), class: '')}"
    end
  end

  def unread_user_notifications
    @unread_user_notifications ||= current_account.notifications.where(recipient_id: current_user.id).unread.size
  end
end