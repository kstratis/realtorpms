module Accounts
  class PropertiesController < Accounts::BaseController
    before_action :set_property, only: [:show, :edit, :update, :destroy]
    before_action :check_page_validity, only: [:index]
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
        @properties = @properties.order(:created_at)
      end

      # puts @properties.to_yaml

      @properties = @properties.paginate(page: params[:page], :per_page => 10)
      # @users = User.paginate(page: params[:page], :per_page => 10)
      @propertieslist = {:dataset => Array.new}

      @properties.each do |property|
        hash = {
            id: property.id,

            description: property.description,
            size: property.size,
            type: property.price,
            view_entity_path: property_path(property.id),
            edit_entity_path: edit_property_path(property.id),
            # assignments: property.properties.count,
            # registration: property.created_at.to_formatted_s(:long)
            registration: property.created_at.strftime('%d %b. %y')
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
                                   current_page: @properties.current_page }, status: 200}
      end






    end


    # GET /properties/1
    # GET /properties/1.json
    def show
      @property = Property.find(params[:id])
      print_users
    end

    # GET /properties/new
    def new
      @property = Property.new
    end

    # GET /properties/1/edit
    def edit
    end


    # POST /properties
    # POST /properties.json
    def create
      puts 'INSIDE CREATE'
      # puts property_params[:images]
      # puts property_params[:images].class
      @property = Property.new(property_params)
      @property.account = current_account

      # puts session[:attachments]


      # session[:attachments].each do |attachment|
      #   @property.images.attach(io: File.read(attachment['tempfile']),
      #                           filename: attachment['original_filename'],
      #                           content_type: attachment['content_type'])
      # end
      # @property.images.attach(session[:attachments])
      # @property.images.attach(property_params[:images])
      # @property.user_id = current_user.id if current_user
      # if @property.save!
      #   flash[:success] = 'Property successfully created.'
      #   redirect_to @property
      # else
      #   render 'new'
      # end
      respond_to do |format|
        if @property.save
          format.html { redirect_to @property, notice: 'Property was successfully created.' }
          format.js
      #     format.json { render :show, status: :created, location: @property }
        else
          format.html { render :new }
          format.js
        end
      end
    end

    # PATCH/PUT /properties/1
    # PATCH/PUT /properties/1.json
    def update
      respond_to do |format|
        if @property.update(property_params)
          format.html { redirect_to @property, notice: 'Property was successfully updated.' }
          format.json { render :show, status: :ok, location: @property }
        else
          format.html { render :edit }
          format.json { render json: @property.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /properties/1
    # DELETE /properties/1.json
    def destroy
      @property.destroy
      respond_to do |format|
        format.html { redirect_to properties_url, notice: 'Property was successfully destroyed.' }
        format.json { head :no_content }
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
        params.require(:property).permit(:description, :propertycategory, :propertytype, :price, :size, :construction, images: [])
      end


  end
end
