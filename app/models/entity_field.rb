class EntityField < ApplicationRecord
  belongs_to :model_type
  default_scope { order(:created_at) }
  before_create :calculate_slug

  # Calculates a unique slug upon creation
  def calculate_slug
    slug = I18n.transliterate(name.split(/[\s,.;:"']/).reject(&:empty?).join('_')).downcase + '_' + rand(1..999).to_s
    self.slug = slug
  end
end
