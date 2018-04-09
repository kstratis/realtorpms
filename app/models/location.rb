class Location < ApplicationRecord
  belongs_to :country
  has_many :properties

  # Basically class methods defined on singleton class
  class << self

    def search(search)
      if search
        # where('unaccent(last_name) ILIKE unaccent(?)', "%#{search}%").or(where('unaccent(first_name) ILIKE unaccent(?)', "%#{search}%")).or(where('email LIKE ?', "%#{search}%"))
        puts search
      end
    end

  end


end
