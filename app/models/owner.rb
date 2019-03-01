class Owner < ApplicationRecord
  has_many :properties

  # Basically class methods defined on singleton class
  class << self

    def search(search)
      if search
        # where('unaccent(last_name) ILIKE unaccent(?)', "%#{search}%").or(where('unaccent(first_name) ILIKE unaccent(?)', "%#{search}%")).or(where('email LIKE ?', "%#{search}%"))
        where('unaccent(first_name) ILIKE unaccent(?)', "%#{search}%").or(where('unaccent(last_name) ILIKE unaccent(?)', "%#{search}%")).or(where('unaccent(email) ILIKE unaccent(?)', "%#{search}%")).or(where('unaccent(telephones) ILIKE unaccent(?)', "%#{search}%")).limit(5)
        # puts search
      end
    end

  end

end
