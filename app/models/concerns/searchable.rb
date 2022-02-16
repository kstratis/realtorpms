# We use the postgres unaccent to cater for unicode accents and ilike for case insensitive searches
# https://gist.github.com/jfragoulis/9914900
module Searchable
  extend ActiveSupport::Concern

  module ClassMethods

    # Once the module is included, it specifies which fields to look into
    def attr_searchable(fields)
      raise unless fields.kind_of?(Array) && !fields.blank?
      const_set('SEARCH_FIELDS', fields)
    end

    # Once included in a model it defines a class method which allows us to search through a collection of
    # entries. In order to properly work it requires that a model specifies the +:SEARCH_FIELDS+ constant which dictates
    # which model fields to search on. It also provides (very) limited support for looking through to an associated
    # model using the dot ('.') character. However note that it's the responsibility of the developer to ensure that
    # any associations are already established and operational.
    def search(term, filter = nil, limit = nil)
      # Dynamically get the fields from the model
      fields = const_get(:SEARCH_FIELDS).dup
      # Even if one of them contains a dot that means we'll also have to search the associated model
      associated_field = fields.detect { |field| field.include?('.') }
      # Get the associated model
      associated_model = associated_field.blank? ? nil : associated_field.split('.').first
      # Once we have the associated model, normalize all fields (i.e. in +mymodel.myfield+ removes the +mymodel.part+)
      fields = fields.map do |element|
        next element unless element.include?('.')
        element.slice((element.index('.') + 1..-1))
      end
      if term && !fields.blank?
        query_string = "unaccent(#{self.name.downcase.pluralize}.#{fields.shift}) ILIKE unaccent('%#{term}%')"

        fields.each do |field|
          query_string << " OR unaccent(#{self.name.downcase.pluralize}.#{field}) ILIKE unaccent('%#{term}%')"
        end

        if filter.present?
          filter_query_string = "#{filter.fetch(:field)} = #{filter.fetch(:value)}"
          final_query = where(query_string).where(filter_query_string)
        else
          final_query = where(query_string)
        end

        # This is the limit parameter. Used mainly in dropwdowns
        if limit.blank?
          associated_model.blank? ? final_query : joins(associated_model.to_sym).final_query
        else
          associated_model.blank? ? final_query.limit(limit) : joins(associated_model.to_sym).final_query.limit(limit)
        end
      end
    end
  end
end


