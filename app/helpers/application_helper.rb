module ApplicationHelper

  # Returns the full title on a per-page basis.
  def full_title(page_title = '')
    base_title = 'Ruby on Rails Tutorial Sample App'
    if page_title.empty?
      base_title
    else
      page_title + ' | ' + base_title
    end
  end

  # +human_enum_name+ is defined in application_record from which all models inherit from as of Rails 5.
  # Here lies an alternative implementation just in case.
  # def human_enum_name(model, enum_name, enum_value )
  #   I18n.t("activerecord.attributes.#{model.model_name.i18n_key}.enums.#{enum_name.to_s}.#{enum_value}")
  # end

end