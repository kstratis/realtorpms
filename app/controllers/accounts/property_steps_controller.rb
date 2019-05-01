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
    def create
      puts 'hitting create'
      @property = Property.create
      @property.account = current_account
      if @property.save
        puts 'prop saved'
        redirect_to wizard_path(steps.first, :property_id => @property.id)
      end

      # format.html {redirect_to property_build_path(:basics, :property_id => @property.id)}
    end

  end
end