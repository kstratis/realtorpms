# We use the postgres unaccent to cater for unicode accents and ilike for case insensitive searches
# https://gist.github.com/jfragoulis/9914900
module Searchable
  extend ActiveSupport::Concern

  module ClassMethods

    def search(term)
      fields = const_get(:SEARCH_FIELDS)
      if term && !fields.blank?
        query = "unaccent(#{fields.shift}) ILIKE unaccent('%#{term}%')"
        fields.each do |field|
          query << "OR unaccent(#{field}) ILIKE unaccent('%#{term}%')"
        end
        where(query)
      end
    end

  end

end


