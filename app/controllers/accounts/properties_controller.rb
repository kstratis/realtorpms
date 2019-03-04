module Accounts
  class PropertiesController < Accounts::BaseController

    before_action :set_property, only: [:show, :edit, :update, :destroy]

    # before_
    # before_action :check_page_validity, only: [:create]

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

      # puts @properties.to_yaml

      @properties = @properties.paginate(page: params[:page], :per_page => 10)
      # @users = User.paginate(page: params[:page], :per_page => 10)
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
            owner_name: property.owner ? "#{property.owner.first_name[0]}. #{property.owner.last_name}" : "-",
            owner_tel: property.owner ? "#{property.owner.telephones}" : "-",
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
    end

    def locations
      puts 'INSIDE the locations'
      filter_locations

      # respond_to do |format|
      #   format.json {render json: {message: 'Working! OK!'}, status: 200}
      # end

    end

    def owners
      puts 'INSIDE the owners'
      filter_owners
      # respond_to do |format|
      #   format.json {render json: {message: 'Working! OK!'}, status: 200}
      # end

    end

    # GET /properties/new
    def new
      @property = Property.new
      @property.build_owner
    end

    # POST /properties
    # POST /properties.json
    def create
      @property = Property.new(property_params)
      # --- SOS ---
      # When POSTing an associated object's id (i.e. location's id only +locationid+) and not the object itself
      # (location instance), you are gonna get the following erro:
      #
      # ActiveModel::UnknownAttributeError - unknown attribute 'locationid' for Property.:
      #
      # This is happening because +locationid+ is not a model attribute and thus appears to be unknown. To fix this
      # you have to declare an attribute accessor of the same name in the model i.e. +attr_accessor :locationid+ which
      # will allow us to receive and manipulate (in that case generate a model instance) the POSTed value. Also don't
      # forget to whitelist the attribute inside the require params and change the html of the form (id & name).
      #
      # Reference
      # https://stackoverflow.com/a/43476033/178728
      # --- SOS ---
      @property.location = Location.find(@property.locationid)

      puts property_params[:ownerid].blank?

      unless property_params[:ownerid].blank?
        @property.owner = Owner.find(@property.ownerid)
      end

      # case property_params[:ownerid]
      # when blank?
      #   "You ran out of gas."
      # else
      #   "Error: capacity has an invalid value (#{capacity})"
      # end

      @property.account = current_account
      # puts @property.locationid
      # @property.location = Location.find(@property.locationid)

      # property_params[:]
      #
      # puts "-------------"
      # puts @property.owner
      # puts "-------------"
      # @property.owner = nil
      # puts "*************"
      # puts @property.owner
      # puts "*************"



      respond_to do |format|
        if @property.save
          puts 'form saving successfully'
          format.html { redirect_to @property, notice: 'Property was successfully created.' }
          format.js { render :create_result }
        else
          @property.errors.each do |field, error|
            puts "#{field}: #{error}"
          end
          format.html { render :new }
          format.js { render :create_result }
        end
      end
    end

    # PATCH/PUT /properties/1
    # PATCH/PUT /properties/1.json
    def update
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
                                       { owner_attributes: [:first_name, :last_name, :email, :telephones] },
                                       images: [],
                                       extra_ids: [])
    end


  end
end
