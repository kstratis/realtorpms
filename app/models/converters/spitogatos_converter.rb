module Converters
  class SpitogatosConverter

    EXCLUDED_PROPERTY_ATTRIBUTES = [:id, :slug, :created_at, :updated_at, :website_enabled, :pinned, :sample, :active,
                                    :account_id, :spitogatos_sync, :spitogatos_created_at, :spitogatos_updated_at,
                                    :spitogatos_id, :ilocation_id].freeze
    # SPITOGATOS_ATTR_MAPPING = {
    #   price: {
    #     name: 'price',
    #     type: 'integer',
    #     category: 'listingDetails'
    #   },
    #   description: {
    #     name: 'descriptionFull',
    #     type: 'integer',
    #     category: 'listingDetails',
    #     nesting: 'gr'
    #   },
    #   description_en: {
    #     name: 'descriptionFull',
    #     type: 'integer',
    #     category: 'listingDetails',
    #     nesting: 'en'
    #   },
    #   businesstype: {
    #     name: 'listingType',
    #     type: 'for rent/for sale',
    #     category: 'listingDetailsYO',
    #     values: {
    #       sell: 'for sale',
    #       rent: 'for rent'
    #     }
    #   }
    # }.freeze

    SPITOGATOS_ATTR_MAPPING = {
      price: {
        name: 'price',
        type: 'integer',
        category: 'listingDetails'
      },
      description: {
        name: 'description',
        type: 'hash',
        category: 'listingDetails',
        nesting: 'gr'
      },
      size: {
        name: 'livingArea',
        type: 'integer',
        category: 'propertyDetails'
      },
      construction: {
        name: 'yearBuilt',
        type: 'integer',
        category: 'propertyDetails'
      },
      renovation: {
        name: 'renovationYear',
        type: 'integer',
        category: 'detailedCharacteristics'
      },
      bedrooms: {
        name: 'rooms',
        type: 'integer',
        category: 'propertyDetails'
      },
      bathrooms: {
        name: 'fullBathrooms',
        type: 'integer',
        category: 'propertyDetails'
      },
      businesstype: {
        name: 'listingType',
        type: 'options',
        category: 'listingDetails',
        values: {
          sell: 'for sale',
          rent: 'for rent'
        }
      },
      floor: {
        name: 'floorNumber',
        type: 'enum',
        category: 'detailedCharacteristics',
      },
      levels: {
        name: 'levels',
        type: 'integer',
        category: 'listingDetails'
      },
      availability: {
        name: 'dateAvailable',
        type: 'date',
        category: 'listingDetails'
      },
      location_id: {
        name: 'geographyId',
        type: 'integer',
        category: 'location'
      }
      # title: ,
      # roofdeck_space: ,
      # storage_space: ,
      # garden_space: ,
      # plot_space: ,
      # notes: ,
      # adxe: ,
      # adspitogatos: ,
      # address: ,
      # favorites_count: ,
      # map_url: ,
      # category_id: ,
      # model_type_id: ,
      # preferences: ,
      # energy_cert: ,
      # has_energy_cert: ,
      # ilocation_id: ,
      # unit: ,
      # facade_length: ,
      # distance_from_sea: ,
      # building_coefficient: ,
      # coverage_ratio: ,
      # description_en: ,
    }.freeze

    def initialize(property)
      @property = property
    end

    def property_attributes
      basic_attributes = (@property.attribute_names - EXCLUDED_PROPERTY_ATTRIBUTES.map(&:to_s)).select do |attr|
        @property.send(attr.to_sym).present?
      end
      extra_attributes = @property.extras.pluck(:name)

      # TODO;
      # location & images

      basic_attributes.concat(extra_attributes)
    end

    # returns a hash
    # name (Spitogatos attribute name: i.e. energy_cert)
    def value_mapper(spitogatos_attr_name, attr)
      value = @property.send(attr)

      case attr
      when :businesstype
        { spitogatos_attr_name => SPITOGATOS_ATTR_MAPPING.dig(attr, :values)[value.to_sym] }
      when :floor
        formatted_value = begin
                            Integer(value)
                          rescue
                            @property.floor.gsub('_', ' ')
                          end

        { spitogatos_attr_name => formatted_value }
      when :availability
        { spitogatos_attr_name => value.to_date.strftime("%d/%m/%Y") }
      else
        { spitogatos_attr_name => value }
      end
    end

    def convert!
      # attrs = property_attributes(property)
      attrs = [:price, :description, :description_en, :businesstype, :floor, :renovation]

      # This is a special hash. If the key does not exist, creates the key and assigns it an empty hash
      # which in turn has the exact same property: if its key does not exist, creates the key and assigns
      # it a empty hash. We need this to cater for spitogatos multilanguage attributes which demonstrate
      # nesting based on language.
      nested_hash_default_hash = Hash.new do |hsh, key|
        hsh[key] = Hash.new do |nested_hsh, nested_key|
          nested_hsh[nested_key] = {}
        end
      end

      attrs.each_with_object(nested_hash_default_hash) do |attr, hsh|
        nesting = SPITOGATOS_ATTR_MAPPING.dig(attr, :nesting).presence
        spitogatos_attr_name = SPITOGATOS_ATTR_MAPPING.dig(attr, :name)&.to_s

        if nesting.present?
          hsh[SPITOGATOS_ATTR_MAPPING.dig(attr, :category)][spitogatos_attr_name]
            .merge!({ nesting.to_s => @property.send(attr) })
        else
          hsh[SPITOGATOS_ATTR_MAPPING.dig(attr, :category)].merge!(value_mapper(spitogatos_attr_name, attr))
        end
      end
    end

  end
end
