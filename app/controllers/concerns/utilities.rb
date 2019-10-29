module Utilities
  extend ActiveSupport::Concern

  # Converts strings to booleans
  def true?(obj)
    obj.to_s.downcase == "true"
  end

end
