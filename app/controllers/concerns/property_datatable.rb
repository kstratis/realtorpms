module PropertyDatatable
  extend ActiveSupport::Concern
  include PropertyHeader
  include CategoryFinder
  include LocationFinder
  include Cfields

  def get_cfields(name)
    current_account.model_types.find_by(name: name).fields.map { |field| {:"#{field.slug}" => field} }
  end

  def filter_properties(relation, filters)

    @properties = relation

    if filters[:locations]
      locations = filters[:locations].split(",").map(&:to_i)
      locations.each do |locationid|
        location = Location.find(locationid)
        if location.level == 3
          @properties = @properties.where(location_id: location.id)
        else # level 1 & 2
          s = Location
                  .select('DISTINCT mainLocations.id')
                  .from(Location.where(parent_id: locationid))
                  .joins('INNER JOIN locations AS mainLocations ON subquery.id = mainLocations.parent_id')
                  .union(Location.select('id')
                             .where(parent_id: locationid).or(Location.select('id').where(id: locationid)))
          @properties = @properties.where(location_id: s)

        end
      end
    end

    # DEBUG - Search filter - Unused for now
    # puts filters[:search]
    if filters[:search]
      @properties = @properties.search(filters[:search])
    end

    # DEBUG - Buy sell filter
    # puts filters[:purpose]
    if filters[:purpose]
      # sell_rent is deactivated "for the sake" of the price range filter
      unless filters[:purpose] == 'sell_rent'
        @properties = @properties.where('businesstype = ?', Property.businesstypes[filters[:purpose].to_sym]).or(@properties.where('businesstype = ?', 2))
      end
    else
      # :sell is the default
      @properties = @properties.where('businesstype = ?', Property.businesstypes[:sell]).or(@properties.where('businesstype = ?', 2))
    end

    # DEBUG - Category filter
    # puts filters[:category], filters[:subcategory]
    if filters[:category] && filters[:subcategory]
      @properties = @properties.where(category: Category.find_by(slug: filters[:subcategory], parent_slug: filters[:category]))
    elsif filters[:category]
      @properties = @properties.joins(:category).where(categories: {parent_slug: filters[:category]})
    end

    if filters[:pricemin]
      @properties = @properties.where("price >= ?", filters[:pricemin])
    end

    if filters[:pricemax]
      @properties = @properties.where("price <= ?", filters[:pricemax])
    end

    if filters[:sizemin]
      @properties = @properties.where("size >= ?", filters[:sizemin])
    end

    if filters[:sizemax]
      @properties = @properties.where("size <= ?", filters[:sizemax])
    end

    if filters[:roomsmin]
      @properties = @properties.where("bedrooms >= ?", filters[:roomsmin])
    end

    if filters[:roomsmax]
      @properties = @properties.where("bedrooms <= ?", filters[:roomsmax])
    end

    if filters[:floorsmin]
      @properties = @properties.where("floor >= ?", filters[:floorsmin])
    end

    if filters[:floorsmax]
      @properties = @properties.where("floor <= ?", filters[:floorsmax])
    end

    if filters[:constructionmin]
      @properties = @properties.where("construction >= ?", filters[:constructionmin])
    end

    if filters[:constructionmax]
      @properties = @properties.where("construction <= ?", filters[:constructionmax])
    end

    # --- Custom fields filtering ---
    initial_cfields = Hash.new
    cfields_dump = get_cfields('properties')
    cfields_raw = filters.keys.grep(/^cfield_/)
    if cfields_raw.any?
      cfields = cfields_raw.map { |cfield| cfield.to_s.split('_')[1..].join('_') }
      cfields.each do |cfield|
        entry = Hash[cfield, filters["cfield_#{cfield}"]]
        initial_cfields[cfield] = entry
        cfield_type = cfields_dump.select { |cf| cf[cfield.to_sym] ? cf[cfield.to_sym] : nil}.first[cfield.to_sym].field_type
        case cfield_type
        when 'dropdown'
        when 'check_box'
          @properties = @properties.where('preferences @> ?', entry.to_json)
        when 'text_field'
          @properties = @properties.where("preferences ->> ? ilike '%#{filters["cfield_#{cfield}"]}%'", cfield)
        else
          'Unknown - contact support'
        end
      end
    end
    # -----------------------------

    # DEBUG - Ordering filter
    # puts filters[:sorting], filters[:ordering]
    if filters[:sorting] && filters[:ordering]
      @properties = @properties.order("#{filters[:sorting]}": filters[:ordering])
    else
      @properties = @properties.order(created_at: 'desc')
    end

    # DEBUG - Pagination
    # puts filters[:page]
    @properties = @properties.paginate(page: filters[:page], :per_page => 10)

    @propertieslist = {:dataset => Array.new}

    @properties.each do |property|
      if forbidden_ids.include?(property.id)
        hash = {
            slug: property.slug,
            avatar: property.avatar.attached? ? url_for(property.avatar) : nil,
            allow_view: false,
            access_msg: I18n.t('access_denied')
        }
      else
        hash = {
            id: property.id,
            title: property.title,
            description: property.description,
            mini_heading: mini_heading(property),
            size: property.size ? I18n.t('activerecord.attributes.property.size_meter_html', size: property.size.to_s) : '',
            price: property.price ? ActionController::Base.helpers.number_to_currency(property.price) : '',
            pricepersqmeter: property.price && property.size ? "#{ActionController::Base.helpers.number_to_currency(property.pricepersqmeter)} / #{I18n.t('activerecord.attributes.property.sm_html')}" : '',
            location: property.location.localname,
            view_entity_path: property_path(property),
            edit_entity_path: edit_property_path(property),
            fav_entity_path: property_favorites_path(property),
            purpose: I18n.t("activerecord.attributes.property.enums.businesstype.#{property.businesstype}_banner"),
            avatar: property.avatar.attached? ? url_for(property.avatar) : nil,
            slug: property.slug,
            # isFaved: property.is_faved_by?(current_user),
            # assignments: property.properties.count,
            # registration: property.created_at.to_formatted_s(:long)
            # registration: property.created_at.strftime('%d %b. %y'),
            registration: l(property.created_at, format: :property),
            landlord_name: property.try(:landlord).try(:first_name) && property.try(:landlord).try(:last_name) ? "#{property.landlord.first_name[0]}. #{property.landlord.last_name}" : I18n.t('js.properties_owner_unavailable'),
            landlord_tel: property.try(:landlord).try(:telephones) ? "#{property.landlord.telephones}" : I18n.t('js.properties_owner_tel_unavailable'),
            allow_view: true
        }
      end
      @propertieslist[:dataset] << hash
    end

    # This basically puts disallowed items at the end of the list without messing with the order of the rest
    @propertieslist[:dataset] = @propertieslist[:dataset].partition { |el| el[:allow_view] }.inject(:+)

    # Initialization
    @total_entries = @properties.total_entries
    @current_page = @properties.current_page
    @results_per_page = 10
    @initial_search = filters[:search] || ''
    @initial_locations = filters[:locations].blank? ? [] : get_initial_locations(filters[:locations].split(','))
    @initial_sorting = filters[:sorting] || 'created_at'
    @initial_ordering = filters[:ordering] || 'desc'
    @initial_purpose = filters[:purpose] || 'sell'
    @initial_property_type = get_initial_category(filters[:category], filters[:sizeminmeta], filters[:sizemaxmeta])
    @initial_category = filters[:category] || ''
    @initial_subcategory = filters[:subcategory] || ''
    @initial_pricemin = filters[:pricemin] || ''
    @initial_pricemax = filters[:pricemax] || ''
    @initial_sizemin = filters[:sizemin] || ''
    @initial_sizemax = filters[:sizemax] || ''
    @initial_roomsmin = filters[:roomsmin] || ''
    @initial_roomsmax = filters[:roomsmax] || ''
    @initial_floorsmin = filters[:floorsmin] || ''
    @initial_floorsmax = filters[:floorsmax] || ''
    @initial_constructionmin = filters[:constructionmin] || ''
    @initial_constructionmax = filters[:constructionmax] || ''
    @initial_cfields = initial_cfields

    respond_to do |format|
      format.html
      format.json { render json: {results_per_page: @results_per_page,
                                  datalist: @propertieslist,
                                  total_entries: @properties.total_entries,
                                  current_page: @properties.current_page}, status: 200 }
    end

  end

end
