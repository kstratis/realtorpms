module Accounts
  class PropertiesController < Accounts::BaseController
    include PropertyHeader
    helper PropertyHeader
    before_action :set_property, only: [:show, :edit, :update, :destroy]

    # GET /properties
    # GET /properties.json
    def index
      # preload location & owner
      @properties = current_user.is_owner?(current_account) ? current_account.properties.includes(:location, :landlord) : current_user.properties.where(account: current_account).includes(:location, :landlord)


      puts '============='
      puts params[:locations]
      puts '============='

      if params[:locations]
        locations = params[:locations].split(",").map(&:to_i)
        @properties = @properties.where(location_id: locations)
        # level2areas = params[:locations].split(",").map(&:to_i).select { |locationid| Location.find(locationid).level == 2 }

        # @properties.
        # puts '======2======'
        # puts level2areas
        # puts '======2======'
        # @properties.where(params[:locations])
        # @properties = @properties.where(location_id: params[:locations])

      end




      if params[:search]
        @properties = @properties.search(params[:search])
      end

      if params[:sorting] && params[:ordering]
        @properties = @properties.order("#{params[:sorting]}": params[:ordering])
      else
        @properties = @properties.order(created_at: 'desc')
      end

      @properties = @properties.paginate(page: params[:page], :per_page => 10)

      @propertieslist = {:dataset => Array.new}

      @properties.each do |property|
        hash = {
            id: property.id,
            title: property.title,
            description: property.description,
            mini_heading: mini_heading(property),
            size: property.size ? I18n.t('activerecord.attributes.property.size_meter_html', size: property.size.to_s) : '',
            price: property.price ? ActionController::Base.helpers.number_to_currency(property.price) : '',
            pricepersqmeter: property.price && property.size ? "#{ActionController::Base.helpers.number_to_currency(property.pricepersqmeter)} / #{I18n.t('size.sqmeters')}" : '',
            location: property.location.localname,
            view_entity_path: property_path(property.id),
            edit_entity_path: edit_property_path(property.id),
            fav_entity_path: property_favorites_path(property.id),
            # isFaved: property.is_faved_by?(current_user),
            # assignments: property.properties.count,
            # registration: property.created_at.to_formatted_s(:long)
            registration: property.created_at.strftime('%d %b. %y'),
            landlord_name: property.try(:landlord).try(:first_name) && property.try(:landlord).try(:last_name) ? "#{property.landlord.first_name[0]}. #{property.landlord.last_name}" : I18n.t('js.properties_owner_unavailable'),
            landlord_tel: property.try(:landlord).try(:telephones) ? "#{property.landlord.telephones}" : I18n.t('js.properties_owner_tel_unavailable'),
        }
        @propertieslist[:dataset] << hash
      end

      @total_entries = @properties.total_entries
      @current_page = @properties.current_page
      @results_per_page = 10
      @initial_search = params[:search] || ''
      @initial_sorting = params[:sorting] || 'created_at'
      @initial_ordering = params[:ordering] || 'desc'

      respond_to do |format|
        format.html
        format.json {render json: {results_per_page: @results_per_page,
                                   userslist: @propertieslist,
                                   total_entries: @properties.total_entries,
                                   current_page: @properties.current_page}, status: 200}
      end


    end


    # GET /properties/1
    # GET /properties/1.json
    def show
      @property = current_account.properties.find(params[:id])
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
          html = render_to_string({template: 'accounts/properties/printable', layout: 'printer/printable', locals: { pictures: pictures}})
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
        format.js {render 'accounts/properties/avatar_removed', locals: {resource: property}}
        # format.json {render json: {}, status: :no_content}
      end


      # redirect_to edit_property_path(property)
    end

    # GET /properties/1/edit
    def edit
      @property = current_account.properties.find(params[:id])
      @property.build_landlord unless @property.landlord
    end

    def locations
      search(Location, {value: 'id', label: %w(localname parent_localname)})
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
      @property = Property.new(property_params)
      set_landlord
      set_location

      # Scope the property to current account. This is only set once.
      @property.account = current_account

      respond_to do |format|
        if @property.save
          format.html {redirect_to @property, notice: I18n.t('properties.created.flash')}
          format.js {render 'shared/ajax/handler',
                            locals: {resource: @property,
                                     action: 'created',
                                     partial_success: 'shared/ajax/success',
                                     partial_failure: 'shared/ajax/failure'}}
        else
          @property.errors.each do |field, error|
            puts "#{field}: #{error}"
          end
          format.html {render :new}
          format.js {render 'shared/ajax/handler', locals: {resource: @property,
                                                            action: 'created',
                                                            partial_success: 'shared/ajax/success',
                                                            partial_failure: 'shared/ajax/failure'}}
        end
      end
    end

    # PATCH/PUT /properties/1
    # PATCH/PUT /properties/1.json
    def update
      set_landlord
      set_location

      params[:delete_images].try :each do |id|
        @property.images.find(id).purge
      end

      respond_to do |format|
        if @property.update(property_params)
          format.html {redirect_to @property, notice: I18n.t('properties.updated.flash')}
          format.js {render 'shared/ajax/handler',
                            locals: {resource: @property,
                                     action: 'updated',
                                     partial_success: 'shared/ajax/success',
                                     partial_failure: 'shared/ajax/failure'}}
        else
          format.html {render :edit}
          format.js {render 'shared/ajax/handler', locals: {resource: @property,
                                                            action: 'updated',
                                                            partial_success: 'shared/ajax/success',
                                                            partial_failure: 'shared/ajax/failure'}}
        end
      end
    end

    # DELETE /properties/1
    # DELETE /properties/1.json
    def destroy
      @property.destroy
      respond_to do |format|
        format.html {redirect_to properties_url, flash: I18n.t('properties.destroyed.flash')}
        format.json {head :no_content}
      end
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_property
      @property = current_account.properties.find(params[:id])
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
      # +accepts_nested_attributes_for :landlord+ as described in the model file
    end

    def set_location
      # Assign the property's location no matter what.
      @property.location = Location.find(params[:action] == 'update' ? property_params[:locationid] : @property.locationid)
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def property_params
      # params.require(:property).permit(:description, :propertycategory, :propertytype, :price, :size, :construction)
      params.require(:property).permit(:description,
                                       :businesstype,
                                       :category,
                                       :subcategory,
                                       :locationid,
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
