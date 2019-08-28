class Landlord < ApplicationRecord
  belongs_to :account
  has_many :properties

  def full_name
    "#{first_name} #{last_name}"
  end

  # Basically class methods defined on singleton class
  class << self

    # In the case of landlord, just ignore the filter
    def search(search, filter)
      if search
        where('unaccent(first_name) ILIKE unaccent(?)', "%#{search}%").or(where('unaccent(last_name) ILIKE unaccent(?)', "%#{search}%")).or(where('unaccent(email) ILIKE unaccent(?)', "%#{search}%")).or(where('unaccent(telephones) ILIKE unaccent(?)', "%#{search}%")).limit(5)
      end
    end

  end

end
