class Location < ApplicationRecord
  belongs_to :country
  has_many :properties

  # Basically class methods defined on singleton class
  class << self

    def search(search, filter)
      # DEBUG
      # puts "The given filter is: #{filter}"
      if search
        if filter.blank?
          where('unaccent(localname) ILIKE unaccent(?)', "%#{search}%").limit(5)
        else
          where("unaccent(localname) ILIKE unaccent(?) AND #{filter.fetch(:field)} = ?", "%#{search}%", filter.fetch(:value)).limit(5)
        end
      end
    end

  end

end
