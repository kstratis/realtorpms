class Location < ApplicationRecord
  include Searchable

  belongs_to :country
  has_many :properties

  attr_searchable %w(localname globalname)

  # # Basically class methods defined on singleton class
  # class << self
  #
  #   def search(search, filter)
  #     # DEBUG
  #     # puts "The given filter is: #{filter}"
  #     if search
  #       if filter.blank?
  #         where('unaccent(localname) ILIKE unaccent(?)', "%#{search}%").limit(5)
  #       else
  #         where("unaccent(localname) ILIKE unaccent(?) AND #{filter.fetch(:field)} = ?", "%#{search}%", filter.fetch(:value)).limit(5)
  #       end
  #     end
  #   end
  #
  # end

end
