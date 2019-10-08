module Accounts
  class PropertiesController < Accounts::BaseController
    include PropertyHeader
    helper PropertyHeader
    before_action :set_property, only: [:show, :edit, :update, :destroy]
    after_action :log_action, only: [:create, :update, :destroy]

    # GET /properties
    # GET /properties.json
    def index
      # preload location & owner
      # @properties = %w(sysadmin owner).include?(current_user.role(current_account)) ? current_account.properties.includes(:location, :landlord) : current_user.properties.where(account: current_account).includes(:location, :landlord)
      filter_properties(current_account.properties.includes(:location, :landlord), params)
    end


    # GET /properties/1
    # GET /properties/1.json
    def show
      set_access and return
      # friendly ids history slugs should not result in 404
      unless [property_path(@property), property_path(@property) + '?print=true'].include?(request.path)
        return redirect_to @property, :status => :moved_permanently
      end
      if current_user.is_admin?(current_account)
        filter_persons(current_account.users)
      end
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
      # If an old id or a numeric id was used to find the record, then
      # the request path will not match the post_path, and we should do
      # a 301 redirect that uses the current friendly id.
      # DEBUG
      # puts request.path
      # puts property_path(@property)
      if request.path != edit_property_path(@property)
        return redirect_to @property, :status => :moved_permanently
      end
      @property.build_landlord unless @property.landlord
    end

    def locations
      search(Location, {value: 'id', label: %w(localname parent_localname)}, I18n.locale == :el ? {field: 'country_id', value: 1} : nil)
    end

    def landlords
      search(Landlord, {value: 'id', label: %w(first_name last_name)})
    end

    def inlinesearch
      if current_user.is_admin?(current_account)
        search(current_account.properties, {value: 'slug', label: %w(slug)})
      else
        search(current_user.properties, {value: 'slug', label: %w(slug)})
      end

    end

    # GET /properties/new
    def new
      # @product = Product.new(product_type_id: params[:product_type_id])
      # @property = Property.new(model_type: ModelType.find(20))
      @property = Property.new(model_type: current_account.model_types.find_by(name: 'properties'))
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
          @property_slug = @property.slug # This is used for the Log model
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
      unless current_user.is_admin?(current_account)
        redirect_to @property and return
      end
      @property_slug = @property.slug
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
    end

    def log_action
      if action_name == 'destroy'
        Log.create(author: current_user, author_name: current_user.full_name, property_name: @property_slug, action: action_name, account: current_account, account_name: current_account.subdomain, entity: 'properties')
      else
        Log.create(author: current_user, author_name: current_user.full_name, property_name: @property.slug, property: @property, action: action_name, account: current_account, account_name: current_account.subdomain, entity: 'properties')
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
                                       :model_type_id,
                                       {preferences: {}},
                                       {landlord_attributes: [:first_name, :last_name, :email, :telephones]},
                                       # attachments: [],
                                       delete_images: [],
                                       images: [],
                                       extra_ids: [])
    end


  end
end

