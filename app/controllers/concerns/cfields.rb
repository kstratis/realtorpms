module Cfields
  extend ActiveSupport::Concern

  def get_cfields(name)
    current_account.model_types.find_by(name: name).fields.map { |field| {:"#{field.slug}" => field} }
  end

end
