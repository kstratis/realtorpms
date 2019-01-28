module Accounts
  class PropertyStepsController < Accounts::BaseController
    include Wicked::Wizard

    steps :basics, :details, :optionals, :media

    def show
      @property = Property.find(params[:property_id])
      render_wizard
    end


    def update
      @property = Property.find(params[:property_id])
      @property.update_attributes(params[:property])
      render_wizard @property
    end
    #
    #
    # def create
    #   @product = Product.create
    #   redirect_to wizard_path(steps.first, :product_id => @product.id)
    # end

  end
end