module Accounts
  class PropertiesController < Accounts::BaseController
    include PropertyHeader
    include CategoryFinder
    helper PropertyHeader
    before_action :set_property, only: [:show, :edit, :update, :destroy]


    # GET /properties
    # GET /properties.json
    def index
      # preload location & owner
      # @properties = %w(sysadmin owner).include?(current_user.role(current_account)) ? current_account.properties.includes(:location, :landlord) : current_user.properties.where(account: current_account).includes(:location, :landlord)
      @properties = current_account.properties.includes(:location, :landlord)
      # DEBUG - Locations filter
      # puts params[:locations]

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
              pricepersqmeter: property.price && property.size ? "#{ActionController::Base.helpers.number_to_currency(property.pricepersqmeter)} / #{I18n.t('size.sqmeters')}" : '',
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


    # GET /properties/1
    # GET /properties/1.json
    def show
      set_access and return
      filter_users
      respond_to do |format|
        if params['print']
          pictures = []
          if @property.images.attached? || @property.avatar.attached?
            @property.all_images[0..3].each do |image|
              pictures << image.variant(resize: '400x250').processed.service_url
            end
          end
          # @property.all_images[0..3]
          html = render_to_string({template: 'accounts/properties/printable', layout: 'printer/printable', locals: {pictures: pictures}})
          pdf = Grover.new(html, display_url: root_url).to_pdf
          # pdf = Grover.new(html).to_pdf
          # Demo
          # pdf = Grover.new('https://en.wikipedia.org/wiki/Greece').to_pdf
          format.html do
            send_data pdf, type: "application/pdf", disposition: "inline"
          end
          # Used to be:
          # format.html {render 'accounts/properties/printable', layout: 'printer/printable'}
        else
          format.html
          format.json
        end
      end
    end

    def delete_avatar
      property = current_account.properties.find(params[:id])
      property.avatar.purge if property.avatar.attached?
      # property.reload
      # render :json => {:status => "OK", :type => 'unfaved' }
      respond_to do |format|
        format.html
        format.js { render 'accounts/properties/avatar_removed', locals: {resource: property} }
        # format.json {render json: {}, status: :no_content}
      end
      # redirect_to edit_property_path(property)
    end

    # GET /properties/1/edit
    def edit
      set_access and return
      @property.build_landlord unless @property.landlord
    end

    def locations
      search(Location, {value: 'id', label: %w(localname parent_localname)}, I18n.locale == :el ? {field: 'country_id', value: 1} : nil)
    end

    def landlords
      search(Landlord, {value: 'id', label: %w(first_name last_name)})
    end

    # GET /properties/new
    def new
      @property = Property.new
      @property.build_landlord
    end

    # POST /properties
    # POST /properties.json
    def create
      normalized_property_params = reconstruct_category(property_params)
      @property = Property.new(normalized_property_params)
      set_landlord
      set_location
      set_category
      # Scope the property to current account. This is only set once.
      @property.account = current_account

      respond_to do |format|
        if @property.save
          if current_user.role(current_account) == 'user'
            current_user.properties <<  @property
          end
          format.html { redirect_to @property, notice: I18n.t('properties.created.flash') }
          format.js { render 'shared/ajax/handler',
                             locals: {resource: @property,
                                      action: 'created',
                                      partial_success: 'shared/ajax/success',
                                      partial_failure: 'shared/ajax/failure'} }
        else
          @property.errors.each do |field, error|
            puts "#{field}: #{error}"
          end
          format.html { render :new }
          format.js { render 'shared/ajax/handler', locals: {resource: @property,
                                                             action: 'created',
                                                             partial_success: 'shared/ajax/success',
                                                             partial_failure: 'shared/ajax/failure'} }
        end
      end
    end

    # PATCH/PUT /properties/1
    # PATCH/PUT /properties/1.json
    def update
      normalized_property_params = reconstruct_category(property_params)
      set_landlord
      set_location
      set_category

      params[:delete_images].try :each do |id|
        @property.images.find(id).purge
      end

      respond_to do |format|
        if @property.update(normalized_property_params)
          format.html { redirect_to @property, notice: I18n.t('properties.updated.flash') }
          format.js { render 'shared/ajax/handler',
                             locals: {resource: @property,
                                      action: 'updated',
                                      partial_success: 'shared/ajax/success',
                                      partial_failure: 'shared/ajax/failure'} }
        else
          format.html { render :edit }
          format.js { render 'shared/ajax/handler', locals: {resource: @property,
                                                             action: 'updated',
                                                             partial_success: 'shared/ajax/success',
                                                             partial_failure: 'shared/ajax/failure'} }
        end
      end
    end

    # DELETE /properties/1
    # DELETE /properties/1.json
    def destroy
      @property.destroy
      respond_to do |format|
        format.html { redirect_to properties_url, notice: I18n.t('properties.destroyed.flash') }
        format.json { head :no_content }
      end
    end


    private

    # Use callbacks to share common setup or constraints between actions.
    def set_property

      @property = current_account.properties.find(params[:id])

      # If an old id or a numeric id was used to find the record, then
      # the request path will not match the post_path, and we should do
      # a 301 redirect that uses the current friendly id.
      if request.path != property_path(@property)
        return redirect_to @property, :status => :moved_permanently
      end
    end

    def set_access
      if forbidden_ids.include?(@property.id)
        redirect_to properties_path and return true
      end
    end

    # Sets the selected landlord
    def set_landlord
      # --- SOS ---
      # When POSTing an associated object's id (i.e. location's id only +locationid+) and not the object itself
      # (location instance), you are gonna get the following error:
      #
      # ActiveModel::UnknownAttributeError - unknown attribute 'locationid' for Property.:
      #
      # This is happening because +locationid+ is not a model attribute and thus appears to be unknown. To fix this
      # you have to declare an attribute accessor of the same name in the model i.e. +attr_accessor :locationid+ which
      # will allow us to receive and manipulate (in this case generate a model instance) the POSTed value. Also don't
      # forget to whitelist the attribute inside the require params and change the html of the form (id & name).
      #
      # Reference
      # https://stackoverflow.com/a/43476033/178728
      # --- SOS ---
      # If an existing landlord id is given then assign the property to that person
      unless property_params[:landlordid].blank?
        @property.landlord = Landlord.find(params[:action] == 'update' ? property_params[:landlordid] : @property.landlordid)
      end

      # If no landlord is selected set it to nil
      unless property_params[:nolandlord].blank?
        @property.landlord = nil
      end

      # Otherwise automatically create and assign the landlord using the "magic" properties of
      # +accepts_nested_attributes_for :landlord+ as described in the model file.
      # In this case don't forget to set the account foreign key on the landlord.
      if property_params[:landlordid].blank? && property_params[:nolandlord].blank?
        if params[:action] == 'create'
          @property.landlord.account = current_account
        end
      end
    end

    def set_location
      # Assign the property's location no matter what.
      @property.location = Location.find(params[:action] == 'update' ? property_params[:locationid] : @property.locationid)
    end

    def reconstruct_category(parameters)
      # @category_instance = params[:action] == 'update' ? Category.find_by(slug: parameters[:subcategory], parent_slug: parameters[:category]) : Category.find(@property.category.id)
      @category_instance = Category.find_by(slug: parameters[:subcategory], parent_slug: parameters[:category])
      if @category_instance
        parameters.to_h.except!(:category, :subcategory)
      else
        raise
      end
    end

    def set_category
      @property.category = @category_instance
    end

    def forbidden_ids
      unless current_user.is_admin?(current_account)
        return current_account.properties.where.not(id: current_user.properties.where(account: current_account).includes(:location, :landlord)).pluck(:id)
      end
      []
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def property_params
      # params.require(:property).permit(:description, :propertycategory, :propertytype, :price, :size, :construction)
      params.require(:property).permit(:description,
                                       :businesstype,
                                       :locationid,
                                       :categoryid,
                                       :category,
                                       :subcategory,
                                       :bedrooms,
                                       :bathrooms,
                                       :price,
                                       :size,
                                       :floor,
                                       :levels,
                                       :availability,
                                       :construction,
                                       :roofdeck_space,
                                       :storage_space,
                                       :garden_space,
                                       :plot_space,
                                       :address,
                                       :notes,
                                       :adxe,
                                       :adspitogatos,
                                       :landlordid,
                                       :nolandlord,
                                       :avatar,
                                       :map_url,
                                       {landlord_attributes: [:first_name, :last_name, :email, :telephones]},
                                       # attachments: [],
                                       delete_images: [],
                                       images: [],
                                       extra_ids: [])
    end


  end
end
