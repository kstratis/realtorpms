module PropertyDatatable
  extend ActiveSupport::Concern
  include PropertyHeader
  include CategoryFinder
  include LocationFinder
  include Cfields

  def fetch_initial_locations
    return if @locations_filter.nil?

    @locations_filter[:value].blank? ? [] : parse_initial_locations(@locations_filter)
  end

  def pick_avatar_pick(property)
    return url_for(property.avatar.variant(resize: "30%")) if property.avatar.attached?

    return if property.all_images.blank?

    url_for(property.all_images.first.variant(resize: "30%"))
  end

  def filter_properties(relation, filters = {})

    @properties = relation

    if filters[:ilocations].present?
      @locations_filter = { label: 'ilocations', value: filters[:ilocations] }
      ilocation_ids = filters[:ilocations].split(",").map(&:to_i)
      @properties = @properties.where(ilocation_id: ilocation_ids)
    elsif filters[:locations].present?
      @locations_filter = { label: 'locations', value: filters[:locations] }
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
                               .where(parent_id: locationid)
                               .or(Location.select('id').where(id: locationid)))
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

    if filters[:active_only]
      @properties = @properties.where(active: true)
    end

    # Custom fields filtering
    @properties, initial_cfields = cfields_filtering('properties', @properties, filters)

    # DEBUG - Ordering filter
    # puts filters[:sorting], filters[:ordering]
    if filters[:sorting] && filters[:ordering]
      @properties = @properties.order("#{filters[:sorting]}": filters[:ordering])
    else
      @properties = @properties.order(created_at: 'desc')
    end

    @force_filters_open = ActiveModel::Type::Boolean.new.cast(filters[:force_filters_open])

    if filters[:preselected_client]
      return unless current_user.is_admin?(current_account) || current_user.clients.pluck(:id).include?(filters[:preselected_client])

      client = Client.find(filters[:preselected_client])
      @preselected_client = [{ label: client.full_name, value: client.id }]
    else
      @preselected_client = []
    end

    # DEBUG - Pagination
    # puts filters[:page]
    @properties = @properties.paginate(page: filters[:page], :per_page => 10)

    @propertieslist = {:dataset => Array.new}

    @properties.each do |property|
      hash = {
        id: property.id,
        title: property.title,
        description: property.description,
        mini_heading: mini_heading(property, property.account),
        size: print_size(property.size, property.account),
        price: property.price ? ActionController::Base.helpers.number_to_currency(property.price, precision: 0, round_mode: :up) : '',
        pricepersize: print_price_per_size(property.pricepersize, property.account),
        location: property.location&.localname || property.ilocation&.area,
        view_entity_path: property_path(property),
        edit_entity_path: edit_property_path(property),
        fav_entity_path: property_favorites_path(property),
        clone_entity_path: clone_property_path(property),
        purpose: I18n.t("activerecord.attributes.property.enums.businesstype.#{property.businesstype}_banner"),
        businesstype: property.businesstype,
        avatar: pick_avatar_pick(property),
        slug: property.slug,
        website_enabled: property.website_enabled,
        pinned: property.pinned,
        sample: property.sample,
        userEditable: current_user.is_admin?(current_account) || current_user.properties.exists?(property.id),
        active: property.active,
        # isFaved: property.is_faved_by?(current_user),
        # assignments: property.properties.count,
        # registration: property.created_at.to_formatted_s(:long)
        # registration: property.created_at.strftime('%d %b. %y'),
        registration: l(property.created_at, format: :property),
        allow_view: true
      }
      @propertieslist[:dataset] << hash
    end

    # This basically puts disallowed items at the end of the list without messing with the order of the rest
    @propertieslist[:dataset] = @propertieslist[:dataset].partition { |el| el[:allow_view] }.inject(:+)

    # Initialization
    @total_entries = @properties.total_entries
    @current_page = @properties.current_page
    @results_per_page = 10
    @initial_search = filters[:search] || ''
    @initial_locations = fetch_initial_locations || ''
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
    @initial_active_only_filter = filters[:active_only] || ''
    @initial_cfields = initial_cfields

    respond_to do |format|
      format.html
      format.json { render json: {results_per_page: @results_per_page,
                                  datalist: @propertieslist,
                                  total_entries: @properties.total_entries,
                                  current_page: @properties.current_page,
                                  force_filters_open: @force_filters_open,
                                  preselected_client: @preselected_client}, status: 200 }
    end

  end

end
