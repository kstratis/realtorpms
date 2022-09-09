module Accounts
  class PropertiesController < Accounts::BaseController
    include PropertyHeader
    include AddRemoveAssociationsHandler
    helper PropertyHeader
    helper Cfields
    helper ForbiddenIds

    before_action :set_property, only: [:show, :edit, :update, :destroy]
    before_action :redirect_to_show, :if => :forbid_access?, :only => [:edit, :update, :destroy]

    after_action :log_action, only: [:create, :update, :destroy], unless: Proc.new { current_user.is_sysadmin? }

    attr_accessor :params_copy, :category, :location_label, :location_value

    attr_reader :property

    helper_method :property

    # GET /properties
    # GET /properties.json
    def index
      # preload location & owner
      # params because the required :property key of the filtered +property_params+ is only available in POST requests
      if current_account.greek?
        filter_properties(current_account.properties.includes(:location), params)
      else
        filter_properties(current_account.properties.includes(:ilocation), params)
      end
    end

    # This is just a proof of concept
    def demo
      puts 'properties_controller#demo'
      respond_to do |format|
        format.html
        format.json
      end
    end

    # POST /properties/:id/clone
    def clone
      property_to_clone = current_account.properties.find(params[:id])

      new_property = property_to_clone.dup.tap do |destination_package|
        if property_to_clone.avatar.attached?
          destination_package.avatar.attach(property_to_clone.avatar.blob)
        end
        if property_to_clone.images.present?
          property_to_clone.images.each do |image|
            destination_package.images.attach(image.blob)
          end
        end
        property_owners = property_to_clone.clients.references(:cpas).where(cpas: { ownership: true })
        destination_package.clients << property_owners if property_owners
      end

      new_property.save!

      Cpa.where(property: new_property).update_all(ownership: true)

      unless current_user.is_admin?(current_account)
        current_user.properties << new_property
      end

      filter_properties(current_account.properties.includes(:location), params)
    end

    # Flagged to sync with Spitogatos
    def sync
      return unless current_account.spitogatos_enabled?

      property_to_sync = current_account.properties.find(params[:id])
      property_to_sync.toggle!(:spitogatos_sync)
      head :ok
    end

    # GET /properties/1
    # GET /properties/1.json
    def show
      # friendly ids history slugs should not result in 404
      unless [property_path(@property), "#{property_path(@property)}?print=true"].include?(request.path)
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
              pictures << rails_representation_url(image.variant(resize: '400x250').processed)
            end
          end
          # @property.all_images[0..3]
          html = render_to_string({template: 'accounts/properties/printable', layout: 'printer/printable', locals: {pictures: pictures}})
          pdf = Grover.new(html, display_url: account_root_url).to_pdf
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
      if property.avatar.attached?
        property.avatar.purge
        # no callback invokation here
        property.update_column(:spitogatos_images_sync_needed, true)
      end
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
      # If an old id or a numeric id was used to find the record, then
      # the request path will not match the post_path, and we should do
      # a 301 redirect that uses the current friendly id.
      # DEBUG
      # puts request.path
      # puts property_path(@property)
      if request.path != edit_property_path(@property)
        return redirect_to @property, :status => :moved_permanently
      end
      # TODO FIX THIS
      # @property.build_landlord unless @property.landlord
    end

    def locations
      search(Location, { value: 'id', label: %w(localname parent_localname) }, I18n.locale == :el ? {field: 'country_id', value: 1} : nil, 5)
    end

    # international locations (tags)
    def ilocations
      search(current_account.ilocations, { value: 'id', label: %w(area) }, nil, 5)
    end

    # Experimental
    def client_locations
      # relation = Account.first.properties.joins(:location).distinct.select('locations.id', 'locations.localname', 'locations.parent_localname')
      # search(Location, { value: 'id', label: %w(localname parent_localname) }, I18n.locale == :el ? {field: 'country_id', value: 1} : nil, 5)
      # render '_locations_from_website'

      render partial: 'accounts/locations_from_website'

    end

    # These are effectively the property landlords.
    def clients
      if current_user.is_admin?(current_account)
        search(current_account.clients, {value: 'id', label: %w(first_name last_name)}, nil, 5)
      else
        search(current_user.clients, {value: 'id', label: %w(first_name last_name)}, nil, 5)
      end

    end

    def inlinesearch
      # Legacy code. Used to be when partners couldn't see the entire inventory
      # if current_user.is_admin?(current_account)
      #   search(current_account.properties, {value: 'slug', label: %w(dropdown_description)}, nil, 5)
      # else
      #   search(current_user.properties.where(account: current_account), {value: 'slug', label: %w(dropdown_description)}, nil, 5)
      # end
      search(current_account.properties, {value: 'slug', label: %w(dropdown_description)}, nil, 5)
    end

    # GET /properties/new
    def new
      @property = current_account.properties.new(model_type: current_account.model_types.find_by(name: 'properties'))
    end

    # POST /properties
    # POST /properties.json
    def create
      self.params_copy = property_params.dup.to_h

      # Notes:
      # Since we need to reconstruct the property's `category` and fetch its `location` before creating the actual
      # location object, we also have to early return if any of those are missing. However in such a scenario the
      # property object wouldn't yet exist and thus we wouldn't be able to put `errors` to it and render our js response
      # as we'd normally do. We'd have to build a second generic js.erb and so on and so forth.
      # Instead we return early and -redirect- to :new using one of the tricks found below:
      # Ref: https://blog.arkency.com/2014/07/4-ways-to-early-return-from-a-rails-controller/
      retrieve_category; return if performed?
      retrieve_location; return if performed?

      clients_hash = params_copy.extract!(:clients)

      @property = current_account.properties.
        new(params_copy.merge({ category_id: category.id }).merge(Hash[attributize_label, location_value]))

      respond_to do |format|
        if @property.save  # model_type is automatically saved within a before_validation hook inside the model
          @property_slug = @property.slug # This is used exclusively for the Log model (logging)
          if current_user.role(current_account) == 'user'
            current_user.properties <<  @property
          end
          # Sets the client and its required ownership attribute on the CPA many-to-many table
          set_client(clients_hash)

          format.html { redirect_to @property, notice: I18n.t('properties.created.flash') }
          # We don't need to set a flash here since we respond with js success page
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
      self.params_copy = property_params.dup.to_h

      unless solo_attribute_update?
        retrieve_category; return if performed?
        retrieve_location; return if performed?
      end

      clients_hash = params_copy.extract!(:clients)

      handle_deleted_images

      respond_to do |format|
        attributes = if solo_attribute_update?
                       params_copy
                     else
                       params_copy.merge({ category_id: category.id }).merge(Hash[attributize_label, location_value])
                     end

        check_for_extra_ids_changes(attributes["extra_ids"])
        @property.assign_attributes(attributes)

        # TODO; Refactor and move to model
        invalidate_blacklisted_attrs
        invalidate_heating_medium

        if @property.save
          # Sets the client and its required ownership attribute on the CPA many-to-many table
          set_client(clients_hash)

          format.html { redirect_to @property, notice: I18n.t('properties.updated.flash') }
          format.js { render 'shared/ajax/handler',
                             locals: {resource: @property,
                                      action: 'updated',
                                      partial_success: 'shared/ajax/success',
                                      partial_failure: 'shared/ajax/failure'} }
          format.json do
            render json: { message: I18n.t('accounts.website_toggle') }, status: :ok
          end
        else

          format.html { render :edit }
          format.js { render 'shared/ajax/handler', locals: { resource: @property,
                                                              action: 'updated',
                                                              partial_success: 'shared/ajax/success',
                                                              partial_failure: 'shared/ajax/failure' } }
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

    def check_for_extra_ids_changes(new_extras)
      return if new_extras.blank?

      new_extra_ids = new_extras.compact_blank
      existing_extra_ids = @property.extra_ids&.compact_blank.presence || []

      if new_extra_ids.map(&:to_i).sort != existing_extra_ids.sort
        @property.update_column(:spitogatos_data_sync_needed, true)
      end
    end

    def handle_deleted_images
      deleted_images_count = 0

      params[:delete_images]&.reject(&:blank?)&.each do |id|
        @property.images.find(id).purge
        deleted_images_count += 1
      end

      return if deleted_images_count.zero?

      @property.update_column(:spitogatos_images_sync_needed, true)
    end

    def redirect_to_show
      flash[:danger] = I18n.t('access_denied')
      redirect_to @property
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_property
      @property = current_account.properties.find(params[:id])
    end

    def log_action
      # If an action fails, @property_slug will be `nil`
      return if @property_slug.nil?

      if action_name == 'destroy'
        Log.create(author: current_user, author_name: current_user.full_name, property_name: @property_slug, action: action_name, account: current_account, account_name: current_account.subdomain, entity: 'properties')
      else
        Log.create(author: current_user, author_name: current_user.full_name, property_name: @property.slug, property: @property, action: action_name, account: current_account, account_name: current_account.subdomain, entity: 'properties')
      end
    end

    def forbid_access?
      forbidden_entity_ids('properties').include?(@property.id)
    end

    # Sets the selected client
    def set_client(clients_hash)
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
      # ---
      #
      # The block parameter is used to set additional attributes on the join model +Cpa+.
      # It basically says: Cpa.where(property: @property, clients: [ids]).update_all(ownership: true)
      associations_handler(@property, 'clients', clients_hash[:clients].blank? ? [] : JSON.parse(clients_hash[:clients])) do |add_ids|
         @property.class.reflections['clients'].options[:through].to_s.singularize.capitalize.constantize.where(property: @property,
                                                                                                                client: current_account.clients.where(id: add_ids)).update_all(ownership: true, account_id: current_account.id)
      end
    end

    # This will either give us `location` or `ilocation`
    def retrieve_location
      # if solo_attribute_update?
      #   self.category = @property.category && return
      # end
      return if params_copy[:locationid].nil? && params_copy[:ilocationid].nil?

      # Looking for a param key which contains the word `location`.
      # Can be either `locationid` or `ilocationid`.
      location_data = params_copy.select { |k, _| k.match(/location/) }
      return unless location_data.keys.one?

      # We parse the location parameters and turn them to an array we can consume
      self.location_label, self.location_value = location_data.transform_values do |location_value|
        parse_location_value(location_value)
      end.to_a.first

      # Remove the `id` part so we can get and instantiate the corresponding model
      location_klass = location_label[0...-2].classify.safe_constantize

      if location_klass.find_by(id: location_value)
        # Exclude the param from further processing
        params_copy.except!(location_label.to_sym)
      else
        flash[:danger] = I18n.t('activerecord.attributes.property.flash_location_missing')
        redirect_to polymorphic_path([:property], action: action_name == 'create' ? :new : :edit)
      end
    end

    def retrieve_category
      # if solo_attribute_update?
      #   self.category = @property.category && return
      # end

      self.category = Category.find_by(slug: params_copy[:subcategory], parent_slug: params_copy[:category])

      if category
        params_copy.except!(:category, :subcategory)
      else
        flash[:danger] = I18n.t('activerecord.attributes.property.flash_category_missing')
        redirect_to polymorphic_path([:property], action: action_name == 'create' ? :new : :edit)
      end
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def property_params
      # noclient may be redundant here
      params.require(:property).permit(:description,
                                       :description_en,
                                       :businesstype,
                                       :locationid,
                                       :ilocationid,
                                       :categoryid,
                                       :category,
                                       :subcategory,
                                       :bedrooms,
                                       :bathrooms,
                                       :wcs,
                                       :living_rooms,
                                       :kitchens,
                                       :common_expenses,
                                       :price,
                                       :size,
                                       :floor,
                                       :levels,
                                       :availability,
                                       :energy_cert,
                                       :construction,
                                       :renovation,
                                       :roofdeck_space,
                                       :storage_space,
                                       :garden_space,
                                       :plot_space,
                                       :balcony_space,
                                       :shopwindow_space,
                                       :address,
                                       :notes,
                                       :adxe,
                                       :adspitogatos,
                                       :website_enabled,
                                       :pinned,
                                       :clients,
                                       :avatar,
                                       :map_url,
                                       :active,
                                       :facade_length,
                                       :distance_from_sea,
                                       :building_coefficient,
                                       :coverage_ratio,
                                       :unit,
                                       :lat,
                                       :lng,
                                       :marker,
                                       :orientation,
                                       :power,
                                       :slope,
                                       :joinery,
                                       :floortype,
                                       :heatingtype,
                                       :heatingmedium,
                                       :access,
                                       :zoning,
                                       { preferences: {} },
                                       delete_images: [],
                                       images: [],
                                       extra_ids: [])
    end

    # Location comes from params and may take the following 2 forms:
    # {'locationid': '106314'} or {'ilocationid': "[{\"label\":\"nolita\", \"value\":9}]".
    # We can only have one of them and we should query only the respective model
    #
    # @return [Integer] The `location` or `ilocation` id
    def parse_location_value(location_value)
      result = JSON.parse(location_value)
      return result if result.is_a? Integer

      result.first['value']
    end

    # location_label is either `locationid` or `ilocationid`.
    # We need to get it to either `location_id` or `ilocation_id`
    #
    # @return [String] The db column to update
    def attributize_label
      "#{location_label[0...-2]}_id"
    end

    def solo_attribute_update?
      action_name == 'update' &&
        request.patch? &&
        property_params[:subcategory].nil? &&
        property_params[:category].nil? &&
        property_params[:locationid].nil? &&
        property_params[:ilocationid].nil?
    end

    def invalidate_blacklisted_attrs
      return unless @property.category_id_changed?

      blacklist_attrs = Property.filters[Category.find(@property.category_id).parent_slug.to_sym]

      blacklist_attrs.each do |attr|
        if @property.respond_to?(attr.to_sym)
          @property.send("#{attr}=", nil)
        else
          extra_attrs = @property.extras.where(subtype: attr.to_s).or(@property.extras.where(name: attr.to_s))
          extra_attrs.each { |extra_attr| @property.extras.delete(extra_attr) }
        end
      end
    end

    def invalidate_heating_medium
      if @property.heatingtype_changed? && (@property.heatingtype.blank? || @property.heatingtype == 'no_system')
          @property.heatingmedium = nil
      end
    end
  end
end

