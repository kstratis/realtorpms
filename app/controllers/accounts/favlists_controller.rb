module Accounts
  class FavlistsController < Accounts::BaseController

    def index
      # puts '++++++++++++++++++++++'
      puts property_id
      # puts params
      # puts '++++++++++++++++++++++'
      render :json => {:status => "OK", :message => jsonify(current_user.favlists, [:id, :name]) }
      # render :json => {:status => "OK", :message => User.find(user_id).favlists.pluck(:id, :name) }
      # respond_to do |format|
      #   format.json {

        # }
      # end
    end

    def create_fav
      puts "create_fav WORKS!!!"
      puts params
      # favlist =
      # current_user.favorite(@property)
    end

    def create
      # def create
      #   current_user.favorite(@property)
      #   render :json => {:status => "OK", :type => 'faved' }
      # end
      puts '++++++'
      puts params
      puts '++++++'
      current_user.favlist_create(params[:name])
      render :json => {:status => "OK", :message => jsonify(current_user.favlists, [:id, :name]) }
    end

    def destroy
      current_user.unfavorite(@property)
      render :json => {:status => "OK", :message => 'List deleted' }
    end

    private

      def property_id
        params.require(:property_id)
      end

      # def user_id
      #   params.require(:user_id)
      # end

  end
end