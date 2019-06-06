module Accounts
  class FavlistsController < Accounts::BaseController

    def index
      render :json => {:status => "OK", :message => jsonify(User.find(user_id).favlists, [:id, :name]) }
      # render :json => {:status => "OK", :message => User.find(user_id).favlists.pluck(:id, :name) }
      # respond_to do |format|
      #   format.json {

        # }
      # end
    end

    def create
      puts '++++++'
      puts params
      puts '++++++'
      current_user.favlist_create(params[:name])
      render :json => {:status => "OK", :message => jsonify(User.find(user_id).favlists, [:id, :name]) }
    end

    def destroy
      current_user.unfavorite(@property)
      render :json => {:status => "OK", :message => 'List deleted' }
    end

    private

      def user_id
        params.require(:user_id)
      end

  end
end