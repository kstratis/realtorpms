class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def self.human_enum_name(parent, child, grandchild=nil)
    I18n.t("activerecord.attributes.#{model_name.i18n_key}.enums.#{parent.to_s}.#{child.to_s}#{'.' + grandchild.to_s if grandchild}")
  end

end
