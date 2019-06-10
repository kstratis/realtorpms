module Accounts
  class FavoritesController < Accounts::BaseController
    # class PropertiesController < Accounts::BaseController
    # before_action :authenticate_user!
    before_action :find_property!

    def create
      # current_user.favorite(@property)
      puts params
      # current_user.favlists.find(params[:favlist_id]).properties << @property
      puts 'created'
      # current_user.favlistsfavorite(@property)
      render :json => {:status => "OK", :message => jsonify(current_user.favlists, [:id, :name]) }
      # render :json => {:status => "OK", :type => 'faved' }
    end

    def destroy
      current_user.favlists.find(params[:favlist_id]).
      # current_user.unfavorite(@property)
      render :json => {:status => "OK", :type => 'unfaved' }
    end

    private

      def find_property!
        @property = Property.find(params[:property_id])
      end

      # def find_favlist!
      #   @favlist = Favlist.find(params[:favlist_id])
      # end
  end
end