module Accounts
  class ModelTypesController < Accounts::BaseController
    before_action :set_model_type, only: [:show, :edit, :update, :destroy]

    # GET /model_types
    # GET /model_types.json
    def index
      @model_types = ModelType.all
    end

    # GET /model_types/1
    # GET /model_types/1.json
    def show
    end

    # GET /model_types/new
    def new
      @model_type = ModelType.new
      # @model_type.fields.build
    end

    # GET /model_types/1/edit
    def edit
      # @fields = @model_type.fields
      # @model_type.fields.build
      # @model_type = ModelType.find(params[:id])
      # @model_type.fields = @model_type.fields.build
      # @model_type.fields.order(created_at: :asc)
      respond_to do |format|
        format.html # show.html.erb
        format.json { render json: @model_type }
      end
    end

    # POST /model_types
    # POST /model_types.json
    def create
      @model_type = ModelType.new(model_type_params)
      @model_type.account = current_account

      respond_to do |format|
        if @model_type.save
          format.html { redirect_to @model_type, notice: 'Model type was successfully created.' }
          format.json { render :show, status: :created, location: @model_type }
        else
          format.html { render :new }
          format.json { render json: @model_type.errors, status: :unprocessable_entity }
        end
      end
    end

    # PATCH/PUT /model_types/1
    # PATCH/PUT /model_types/1.json
    def update
      respond_to do |format|
        if @model_type.update(model_type_params)
          format.html { redirect_to edit_model_type_path(@model_type), notice: I18n.t('cfields.flash_updated') }
          # format.html { redirect_to @model_type, notice: 'Model type was successfully updated.' }
          format.json { render :show, status: :ok, location: @model_type }
        else
          format.html { render :edit }
          format.json { render json: @model_type.errors, status: :unprocessable_entity }
        end
      end
    end

    # DELETE /model_types/1
    # DELETE /model_types/1.json
    def destroy
      @model_type.destroy
      respond_to do |format|
        format.html { redirect_to model_types_url, notice: 'Model type was successfully destroyed.' }
        format.json { head :no_content }
      end
    end

    private


    # Use callbacks to share common setup or constraints between actions.
    def set_model_type
      @model_type = ModelType.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def model_type_params
      params.require(:model_type).permit(:id, :name, {fields_attributes: [:id, :field_type, :name, :required, :_destroy]})
    end
  end
end