module Accounts
  class PropertiesController < Accounts::BaseController

    before_action :set_property, only: [:show, :edit, :update, :destroy]

    # GET /properties
    # GET /properties.json
    def index
      # page number validation
      @properties = Property.all

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
            size: property.size,
            type: property.price,
            view_entity_path: property_path(property.id),
            edit_entity_path: edit_property_path(property.id),
            fav_entity_path: property_favorites_path(property.id),
            isFaved: property.is_faved_by?(current_user),
            # assignments: property.properties.count,
            # registration: property.created_at.to_formatted_s(:long)
            registration: property.created_at.strftime('%d %b. %y'),
            owner_name: property.try(:owner).try(:first_name) && property.try(:owner).try(:last_name) ? "#{property.owner.first_name[0]}. #{property.owner.last_name}" : I18n.t('js.properties_owner_unavailable'),
            owner_tel: property.try(:owner).try(:telephones) ? "#{property.owner.telephones}" : I18n.t('js.properties_owner_tel_unavailable'),
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
      @property = Property.find(params[:id])
      filter_users
    end

    # GET /properties/1/edit
    def edit
      @property = Property.find(params[:id])
      @property.build_owner unless @property.owner
    end

    def locations
      #todo remove puts statement
      puts '-=Locations=- filtering...'
      filter_locations
    end

    def owners
      #todo remove puts statement
      puts '-=Owners=- filtering...'
      filter_owners
    end

    # GET /properties/new
    def new
      @property = Property.new
      @property.build_owner
    end

    # POST /properties
    # POST /properties.json
    def create
      # +set_owner+ is called as a hook method
      @property = Property.new(property_params)
      set_owner
      set_location

      # Scope the property to current account. This is only set once.
      @property.account = current_account

      respond_to do |format|
        if @property.save
          puts 'form saving successfully'
          # todo internationalize the notice message
          format.html {redirect_to @property, notice: 'Property was successfully created.'}
          format.js {render :create_result}
        else
          @property.errors.each do |field, error|
            puts "#{field}: #{error}"
          end
          format.html {render :new}
          format.js {render :create_result}
        end
      end
    end

    # PATCH/PUT /properties/1
    # PATCH/PUT /properties/1.json
    def update
      set_owner
      set_location

      params[:delete_images].try :each do |id|
        @property.images.find(id).purge
      end

      respond_to do |format|
        if @property.update(property_params)
          format.html {redirect_to @property, flash: {success: "Property was successfully updated."}}
          format.json {render :show, status: :ok, location: @property}
        else
          format.html {render :edit}
          format.json {render json: @property.errors, status: :unprocessable_entity}
        end
      end
    end

    # DELETE /properties/1
    # DELETE /properties/1.json
    def destroy
      @property.destroy
      respond_to do |format|
        format.html {redirect_to properties_url, notice: 'Property was successfully destroyed.'}
        format.json {head :no_content}
      end
    end

    private

    # Use callbacks to share common setup or constraints between actions.
    def set_property
      @property = Property.find(params[:id])
    end

    # Sets the selected owner
    def set_owner
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
      # If an existing client(owner) id is given then assign the property to that person
      unless property_params[:ownerid].blank?
        @property.owner = Owner.find(params[:action] == 'update' ? property_params[:ownerid] : @property.ownerid)
      end

      # If no owner is selected set it to nil
      unless property_params[:noowner].blank?
        @property.owner = nil
      end
      # Otherwise automatically create and assign the owner using the "magic" properties of
      # +accepts_nested_attributes_for :owner+ as described in the model file
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
                                       :ownerid,
                                       :noowner,
                                       {owner_attributes: [:first_name, :last_name, :email, :telephones]},
                                       # attachments: [],
                                       delete_images: [],
                                       images: [],
                                       extra_ids: [])
    end


  end
end
