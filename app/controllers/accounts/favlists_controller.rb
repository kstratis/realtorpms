module Accounts
  class FavlistsController < Accounts::BaseController

    def index
      puts "FavlistsController#index"
      puts '######'
      # puts property_id
      puts params
      puts '######'

      list = Array.new

      if params['property_id']
        current_user.favlists.find_each do |favlist|
          list << {id: favlist.id, name: favlist.name, isFaved: favlist.has_faved?(params['property_id'])}
        end
      else
        current_user.favlists.find_each do |favlist|
          list << {id: favlist.id, name: favlist.name}
        end
        # Used to be
        # render :json => {:status => "OK", :message => jsonify(current_user.favlists, [:id, :name]) }
      end
      render :json => {:status => "OK", :message => list}
    end

    def create_favorite
      puts "FavlistsController#create_favorite"
      puts params
      current_user.favlists.find(params['favlist_id']).properties << Property.find(params['property_id'])

      list = Array.new
      current_user.favlists.find_each do |favlist|
        list << {id: favlist.id, name: favlist.name, isFaved: favlist.has_faved?(params['property_id'])}
      end
      render :json => {:status => "OK", :message => list}
    # favlist =
    # current_user.favorite(@property)
    end

    def destroy_favorite
      puts "FavlistsController#destroy_favorite"
      puts params
      current_user.favlists.find(params['favlist_id']).properties.delete(params['property_id'])

      list = Array.new
      current_user.favlists.find_each do |favlist|
        list << {id: favlist.id, name: favlist.name, isFaved: favlist.has_faved?(params['property_id'])}
      end
      render :json => {:status => "OK", :message => list}
    end

    def create
      # def create
      #   current_user.favorite(@property)
      #   render :json => {:status => "OK", :type => 'faved' }
      # end
      puts "FavlistsController#create"
      puts '++++++'
      puts params
      puts '++++++'
      current_user.favlist_create(params[:name])
      current_user.favlists.reload
      list = Array.new
      current_user.favlists.find_each do |favlist|
        list << {id: favlist.id, name: favlist.name, isFaved: favlist.has_faved?(params['property_id'])}
      end
      render :json => {:status => "OK", :message => list}
    end

    def destroy
      # todo
      current_user.unfavorite(@property)
      render :json => {:status => "OK", :message => 'List deleted'}
    end

    # private
    #
    #   def property_id
    #     params.require(:property_id)
    #   end

    # def user_id
    #   params.require(:user_id)
    # end

  end
end