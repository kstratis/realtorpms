# We use the postgres unaccent to cater for unicode accents and ilike for case insensitive searches
# https://gist.github.com/jfragoulis/9914900
module Searchable
  extend ActiveSupport::Concern

  module ClassMethods

    # Once included in a model it defines a class method which allows us to search through a collection of
    # entries. In order to properly work it requires that a model specifies the +:SEARCH_FIELDS+ constant which dictates
    # which model fields to look into. It also provides (very) limited support for looking through to an associated
    # model using the dot ('.') character. However note that it's the responsibilty of the developer to ensure that
    # any association are already established and operational.
    def search(term)
      # Dynamically get the fields from the model
      fields = const_get(:SEARCH_FIELDS).dup
      # Even if one of them contains a dot that means we'll also have to search the associated model
      associated_field = fields.detect {|field| field.include?('.')}
      # Get the associated model
      associated_model = associated_field.blank? ? '' : associated_field.split('.').first
      # Once we have the associated model, normalize all fields (i.e. in +mymodel.myfield+ removes the +mymodel.part+)
      fields = fields.map do |element|
        next element unless element.include?('.')
        element.slice((element.index('.') + 1..-1))
      end
      if term && !fields.blank?
        query = "unaccent(#{fields.shift}) ILIKE unaccent('%#{term}%')"
        fields.each do |field|
          query << " OR unaccent(#{field}) ILIKE unaccent('%#{term}%')"
        end
        associated_model ? joins(associated_model.to_sym).where(query) : where(query)
      end
    end
  end
end


