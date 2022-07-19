module Converters
  class SpitogatosConverter

    EXCLUDED_PROPERTY_ATTRIBUTES = [:id, :created_at, :updated_at, :website_enabled, :pinned, :sample, :active,
                                    :account_id, :spitogatos_sync, :spitogatos_created_at, :spitogatos_updated_at,
                                    :ilocation_id, :model_type_id].freeze

    EXTRA_PROPERTY_ATTRIBUTES = %w(display_address currency published_spitogatos heating_controller access_controller view_controller within_city_plan zoning_controller).freeze

    # Heating is handled differently
    EXCLUDED_EXTRA_PROPERTY_ATTRIBUTES = %w(prive central asphalt sidewalk cobblestone dirt_road sea other no_access sea_view mountain_view forest_view infinite_view residential agricultural commercial industrial recreational unincorporated).freeze
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
      description_en: {
        name: 'description',
        type: 'hash',
        category: 'listingDetails',
        nesting: 'en'
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
      wcs: {
        name: 'halfBathrooms',
        type: 'integer',
        category: 'propertyDetails'
      },
      living_rooms: {
        name: 'livingRooms',
        type: 'integer',
        category: 'detailedCharacteristics'
      },
      kitchens: {
        name: 'kitchens',
        type: 'integer',
        category: 'detailedCharacteristics'
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
      },
      latitude: {
        name: 'latitude',
        type: 'decimal',
        category: 'location'
      },
      longitude: {
        name: 'longitude',
        type: 'decimal',
        category: 'location'
      },
      display_address: {
        name: 'displayAddress',
        type: 'string',
        category: 'location',
        handler: :display_address
      },
      marker: {
        name: 'geocodeType',
        type: 'enum',
        category: 'location',
        values: {
          exact: 'exact',
          circle: 'offset',
          nonvisible: 'hidden'
        }
      },
      address: {
        name: 'streetAddress',
        type: 'hash',
        category: 'location',
        nesting: 'gr'
      },
      slug: {
        name: 'brokerListingID',
        type: 'string',
        category: 'listingDetails'
      },
      spitogatos_id: {
        name: 'listingID',
        type: 'integer',
        category: 'listingDetails'
      },
      # title: ,
      # roofdeck_space: ,
      # storage_space: ,
      # garden_space: ,
      # notes: ,
      # adxe: ,
      # adspitogatos: ,
      # favorites_count: ,
      # map_url: ,
      category_id: {
        name: 'category',
        type: 'enum',
        category: 'propertyDetails'
      },
      plot_space: {
        name: 'lotSize',
        type: 'integer',
        category: 'propertyDetails'
      },
      balcony_space: {
        name: 'balconyArea',
        type: 'integer',
        category: 'detailedCharacteristics'
      },
      currency: {
        name: 'currency',
        type: 'string',
        category: 'listingDetails',
        handler: :currency
      },
      new_development: {
        name: 'newDevelopment',
        type: 'string',
        category: 'listingDetails'
      },
      published_spitogatos: {
        name: 'published',
        type: 'string',
        category: 'listingDetails',
        handler: :published_spitogatos
      },
      clima: {
        name: 'airConditioning',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      alarm: {
        name: 'alarm',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      balcony: {
        name: 'balcony',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      # preferences: ,
      # energy_cert: ,
      # has_energy_cert: ,
      # unit: ,
      # facade_length: ,
      # distance_from_sea: ,
      building_coefficient: {
        name: 'buildingCoefficient',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      corner: {
        name: 'corner',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      elevator: {
        name: 'elevator',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      facade: {
        name: 'facade',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      fireplace: {
        name: 'fireplace',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      service_lift: {
        name: 'freightElevator',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      furnished: {
        name: 'furnished',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      parking: {
        name: 'garage',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      garden: {
        name: 'garden',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      heating_controller: {
        name: 'heatingController',
        type: 'enum',
        category: 'detailedCharacteristics',
        handler: :heating_controller,
        values: {
          prive: 'autonomous',
          central: 'central',
          none: 'none'
        }
      },
      load_ramp: {
        name: 'loadingDock',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      penthouse: {
        name: 'penthouse',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      access_controller: {
        name: 'roadType',
        type: 'enum',
        category: 'detailedCharacteristics',
        handler: :access_controller,
        values: {
          asphalt: 'asphalt',
          sidewalk: 'pedestrian',
          cobblestone: 'paved',
          dirt_road: 'dirt road',
          sea: 'sea',
          other: 'other',
          no_access: 'no road access'
        }
      },
      security_door: {
        name: 'secureDoor',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      solar_water_heating: {
        name: 'solarWaterHeating',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      storage: {
        name: 'storageSpace',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      pool: {
        name: 'swimmingPool',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      view_controller: {
        name: 'view',
        type: 'enum',
        category: 'detailedCharacteristics',
        handler: :view_controller,
        values: {
          sea_view: 'sea_view',
          mountain_view: 'mountain_view',
          forest_view: 'forest_view',
          infinite_view: 'infinite_view'
        }
      },
      within_city_plan: {
        name: 'withinCityPlan',
        type: 'string',
        category: 'detailedCharacteristics',
        handler: :city_plan_handler
      },
      zoning_controller: {
        name: 'zoning',
        type: 'enum',
        category: 'detailedCharacteristics',
        handler: :zoning_controller,
        values: {
          residential: 'residential',
          agricultural: 'agricultural',
          commercial: 'commercial',
          industrial: 'industrial',
          recreational: 'recreational',
          unincorporated: 'unincorporated'
        }
      },
      protected_pr: {
        name: 'preserved',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      investment: {
        name: 'investment',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      unfinished: {
        name: 'unfinished',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      night_power: {
        name: 'night_power',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      neoclassical: {
        name: 'neoclassic',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      equipment: {
        name: 'equipped',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      agricultural_use: {
        name: 'agriculturalUse',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      heating_under_floor: {
        name: 'heatingUnderFloor',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      coverage_ratio: {
        name: 'coverageRatio',
        type: 'string',
        category: 'detailedCharacteristics'
      },
      energy_cert: {
        name: 'energyClass',
        type: 'enum',
        category: 'detailedCharacteristics',
        values: {
          a_plus: 'ap',
          a: 'a',
          b_plus: 'b',
          b: 'b',
          c: 'c',
          d: 'd',
          e: 'e',
          z: 'f',
          h: 'g',
          excempt: 'excemption',
          processing: 'under_issuance'
        }
      },
      orientation: {
        name: 'orientation',
        type: 'enum',
        category: 'detailedCharacteristics',
        values: {
          east: 'e',
          east_west: 'ew',
          east_meridian: 'em',
          north: 'n',
          north_east: 'ne',
          north_west: 'nw',
          west: 'w',
          west_meridian: 'wm',
          meridian: 'm',
          south: 's',
          south_east: 'se',
          south_west: 'sw'
        }
      },
      power: {
        name: 'current',
        type: 'enum',
        category: 'detailedCharacteristics',
        values: {
          one_phase: 'single phase',
          three_phase: 'three phase',
          industrial_phase: 'industrial'
        }
      },
      slope: {
        name: 'slope',
        type: 'enum',
        category: 'detailedCharacteristics',
        values: {
          plane: 'plane',
          inclining: 'inclining',
          amphitheatrical: 'amphitheatric'
        }
      },
      no_agent_fee: {
        name: 'noAgentFee',
        type: 'string',
        category: 'detailedCharacteristics'
      }
    }.freeze

    def initialize(property)
      @property = property
    end

    def property_attributes
      basic_attributes = ((@property.attribute_names + EXTRA_PROPERTY_ATTRIBUTES) - EXCLUDED_PROPERTY_ATTRIBUTES.map(&:to_s)).select do |attr|
        @property.send(attr.to_sym).present?
      end
      extra_attributes = property_extras - EXCLUDED_EXTRA_PROPERTY_ATTRIBUTES

      # TODO;
      # location & images

      basic_attributes.concat(extra_attributes)
    end

    # returns a hash
    # name (Spitogatos attribute name: i.e. energy_cert)
    def value_mapper(spitogatos_attr_name, attr)
      handler = SPITOGATOS_ATTR_MAPPING.dig(attr, :handler)

      value = if handler.present?
                send(handler)
              elsif @property.respond_to?(attr) # direct method
                @property.send(attr)
              else # extras method
                property_extras.include?(attr.to_s) ? 'yes' : 'no'
              end

      # DEBUG - Do not erase
      puts "#{BRANDNAME} `attr` is: `#{attr}`, `spitogatos_attr_name` attr is: `#{spitogatos_attr_name}`, `value` is: `#{value}` and handler is: `#{handler.presence}`"
      puts '---'

      case attr
      when :businesstype, :marker, :energy_cert, :orientation  #For simple enum values - no special handler
        { spitogatos_attr_name => SPITOGATOS_ATTR_MAPPING.dig(attr, :values)[value.to_sym] }
      when :floor
        formatted_value = begin
                            Integer(value)
                          rescue
                            @property.floor&.gsub('_', ' ')
                          end

        { spitogatos_attr_name => formatted_value }
      when :availability
        { spitogatos_attr_name => value.to_date.strftime("%d/%m/%Y") }
      when :category_id
        { spitogatos_attr_name => @property.category.parent_slug, 'propertyType' => @property.category.spitogatos_slug }
      when :plot_space, :balcony_space
        formatted_value = begin
                            Integer(value)
                          rescue
                            0
                          end
        { spitogatos_attr_name => formatted_value }
      when :spitogatos_id
        formatted_value = begin
                            Integer(value)
                          rescue
                            nil
                          end
        if formatted_value.present?
          { spitogatos_attr_name => formatted_value }
        end
      else
        { spitogatos_attr_name => value }
      end
    end

    def convert!
      # attrs = property_attributes
      attrs = [:price, :description, :description_en, :businesstype, :floor, :renovation, :display_address, :marker, :category_id, :plot_space, :balcony_space,
               :currency, :spitogatos_id, :new_development, :published_spitogatos, :clima, :alarm, :balcony, :building_coefficient, :corner, :elevator, :facade, :fireplace,
               :service_lift, :furnished, :parking, :garden, :heating_controller, :load_ramp, :penthouse, :access_controller, :security_door, :solar_water_heating, :storage,
               :pool, :view_controller, :within_city_plan, :zoning_controller, :protected_pr, :investment, :unfinished, :night_power, :neoclassical, :equipment, :agricultural_use,
               :heating_under_floor, :coverage_ratio, :energy_cert, :orientation, :power, :slope, :no_agent_fee, :wcs, :living_rooms, :kitchens]

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

        # debug
        # puts "Iterating for: #{spitogatos_attr_name}"

        if nesting.present?
          hsh[SPITOGATOS_ATTR_MAPPING.dig(attr, :category)][spitogatos_attr_name]
            .merge!({ nesting.to_s => @property.send(attr) })
        else
          # `value_mapper` may return `nil` (see `spitogatos_id` / `listingID` case)
          new_entry = value_mapper(spitogatos_attr_name, attr)
          next if new_entry.blank?

          hsh[SPITOGATOS_ATTR_MAPPING.dig(attr, :category)].merge!(new_entry)
        end
      end
    end

    private

    def display_address
      return 'yes' if @property.exact?

      'no'
    end

    def currency
      'eur'
    end

    def published_spitogatos
      'yes'
    end

    def heating_controller
      private_heating = property_extras.include?('prive') ? 'prive' : nil
      central_heating = property_extras.include?('central') ? 'central' : nil
      value = if private_heating.nil? && central_heating.nil?
                :none
              elsif private_heating.present? && central_heating.blank?
                :prive
              elsif private_heating.nil? && central_heating.present?
                :central
              else
                :central
              end

      SPITOGATOS_ATTR_MAPPING.dig(:heating_controller, :values)[value]
    end

    def view_controller
      view_attrs = property_extras.intersection(%w(sea_view mountain_view forest_view infinite_view))
      return 'no' if view_attrs.empty?

      'yes'
    end

    def access_controller
      access_attrs = property_extras.intersection(%w(asphalt sidewalk cobblestone dirt_road sea other no_access))
      value = if access_attrs.size.zero?
                nil
              else
                access_attrs.first.to_sym
              end

      return if value.nil?

      SPITOGATOS_ATTR_MAPPING.dig(:access_controller, :values)[value]
    end

    def city_plan_handler
      if property_extras.include?('unincorporated')
        'no'
      else
        'yes'
      end
    end

    def zoning_controller
      zoning_attrs = property_extras.intersection(%w(residential agricultural commercial industrial recreational unincorporated))
      value = if zoning_attrs.size.zero?
                nil
              else
                zoning_attrs.first.to_sym
              end

      return if value.nil?

      SPITOGATOS_ATTR_MAPPING.dig(:zoning_controller, :values)[value]
    end

    def property_extras
      @property_extras ||= @property.extras.pluck(:name)
    end

  end
end
