class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def self.human_enum_name(enum_name, enum_value)
    I18n.t("activerecord.attributes.#{model_name.i18n_key}.enums.#{enum_name.to_s}.#{enum_value}")
  end

end
