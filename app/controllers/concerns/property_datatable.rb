module PropertyDatatable
  extend ActiveSupport::Concern

  def filter_properties(relation)

    @properties = relation

    if params[:locations]
      locations = params[:locations].split(",").map(&:to_i)
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
    # puts params[:search]
    if params[:search]
      @properties = @properties.search(params[:search])
    end

    # DEBUG - Buy sell filter
    # puts params[:purpose]
    if params[:purpose]
      # sell_rent is deactivated "for the sake" of the price range filter
      unless params[:purpose] == 'sell_rent'
        @properties = @properties.where('businesstype = ?', Property.businesstypes[params[:purpose].to_sym]).or(@properties.where('businesstype = ?', 2))
      end
    else
      # :sell is the default
      @properties = @properties.where('businesstype = ?', Property.businesstypes[:sell]).or(@properties.where('businesstype = ?', 2))
    end

    # DEBUG - Category filter
    # puts params[:category], params[:subcategory]
    if params[:category] && params[:subcategory]
      @properties = @properties.where(category: Category.find_by(slug: params[:subcategory], parent_slug: params[:category]))
    elsif params[:category]
      @properties = @properties.joins(:category).where(categories: {parent_slug: params[:category]})
    end

    if params[:pricemin]
      @properties = @properties.where("price >= ?", params[:pricemin])
    end

    if params[:pricemax]
      @properties = @properties.where("price <= ?", params[:pricemax])
    end

    if params[:sizemin]
      @properties = @properties.where("size >= ?", params[:sizemin])
    end

    if params[:sizemax]
      @properties = @properties.where("size <= ?", params[:sizemax])
    end

    if params[:roomsmin]
      @properties = @properties.where("bedrooms >= ?", params[:roomsmin])
    end

    if params[:roomsmax]
      @properties = @properties.where("bedrooms <= ?", params[:roomsmax])
    end

    if params[:floorsmin]
      @properties = @properties.where("floor >= ?", params[:floorsmin])
    end

    if params[:floorsmax]
      @properties = @properties.where("floor <= ?", params[:floorsmax])
    end

    if params[:constructionmin]
      @properties = @properties.where("construction >= ?", params[:constructionmin])
    end

    if params[:constructionmax]
      @properties = @properties.where("construction <= ?", params[:constructionmax])
    end

    # DEBUG - Ordering filter
    # puts params[:sorting], params[:ordering]
    if params[:sorting] && params[:ordering]
      @properties = @properties.order("#{params[:sorting]}": params[:ordering])
    else
      @properties = @properties.order(created_at: 'desc')
    end

    # DEBUG - Pagination
    # puts params[:page]
    @properties = @properties.paginate(page: params[:page], :per_page => 10)

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
            registration: property.created_at.strftime('%d %b. %y'),
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
    @initial_search = params[:search] || ''
    @initial_locations = params[:locations].blank? ? [] : get_initial_locations(params[:locations].split(','))
    @initial_sorting = params[:sorting] || 'created_at'
    @initial_ordering = params[:ordering] || 'desc'
    @initial_purpose = params[:purpose] || 'sell'
    @initial_property_type = get_initial_category(params[:category], params[:sizeminmeta], params[:sizemaxmeta])
    @initial_category = params[:category] || ''
    @initial_subcategory = params[:subcategory] || ''
    @initial_pricemin = params[:pricemin] || ''
    @initial_pricemax = params[:pricemax] || ''
    @initial_sizemin = params[:sizemin] || ''
    @initial_sizemax = params[:sizemax] || ''
    @initial_roomsmin = params[:roomsmin] || ''
    @initial_roomsmax = params[:roomsmax] || ''
    @initial_floorsmin = params[:floorsmin] || ''
    @initial_floorsmax = params[:floorsmax] || ''
    @initial_constructionmin = params[:constructionmin] || ''
    @initial_constructionmax = params[:constructionmax] || ''

    respond_to do |format|
      format.html
      format.json { render json: {results_per_page: @results_per_page,
                                  userslist: @propertieslist,
                                  total_entries: @properties.total_entries,
                                  current_page: @properties.current_page}, status: 200 }
    end

  end

end
