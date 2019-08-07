class Landlord < ApplicationRecord
  has_many :properties

  def full_name
    "#{first_name} #{last_name}"
  end
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
