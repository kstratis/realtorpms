module Accounts
  class FavoritesController < Accounts::BaseController
    # class PropertiesController < Accounts::BaseController
    # before_action :authenticate_user!
    before_action :find_property!

    def create
      current_user.favorite(@property)
      render :json => {:status => "OK", :type => 'faved' }
    end

    def destroy
      current_user.unfavorite(@property)
      render :json => {:status => "OK", :type => 'unfaved' }
    end

    private

      def find_property!
        @property = Property.find(params[:property_id])
      end
  end
end