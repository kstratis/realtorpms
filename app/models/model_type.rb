class ModelType < ApplicationRecord
  belongs_to :account
  has_many :fields, class_name: 'EntityField', dependent: :destroy
  accepts_nested_attributes_for :fields, allow_destroy: true
  has_and_belongs_to_many :users, -> {distinct}

  def localized_name
    I18n.t("cfields.categories.#{self.name}")
  end
end
