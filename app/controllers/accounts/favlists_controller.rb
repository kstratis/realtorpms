module Accounts
  class FavlistsController < Accounts::BaseController

    # Creates a new favorite property and places it in a favlist of your choosing
    # Expects a favlist_id and a property_id
    def create_favorite
      current_user.favlists.find(params['favlist_id']).properties << current_account.properties.find(params['property_id'])
      render json: {status: "OK", message: render_favlists}
    end

    # Destroys an existing favorite property and removes it from its favlist
    # Expects a favlist_id and a property_id
    def destroy_favorite
      current_user.favlists.find(params['favlist_id']).properties.delete(params['property_id'])
      render json: {status: "OK", message: render_favlists}
    end

    # List all user favlists
    def index
      @favlists = render_favlists
      respond_to do |format|
        format.html # We also need to respond to normal requests for this one
        format.json { render json: {status: "OK", message: @favlists} }
      end
    end

    # List all properties of a particular favlist
    # Note that the +Show+ and +index+ actions render the same screen
    def show
      @favlist = current_user.favlists.find(params[:id])
      @favlists = render_favlists
      searchprefs = {}
      if params[:page]
        searchprefs[:page] = params[:page]
      end
      filter_properties(@favlist.properties.includes(:location), searchprefs)
    end

    # Creates a new favlist
    def create
      current_user.favlist_create(params[:name], current_account)
      current_user.favlists.reload
      render json: {status: "OK", message: render_favlists}
    end

    # Destroys an existing favlist and all the favorites it included
    def destroy
      current_user.favlists.find(params[:id]).destroy!
      respond_to do |format|
        format.html {
          flash[:success] = I18n.t 'js.components.modal.favlists.deleted'
          redirect_to favlists_url
        }
        format.json { render :json => {:status => "OK", :message => render_favlists} }
      end
    end

    private
      def render_favlists
        Favlist.with_param(current_user.id, params['property_id'] ? params['property_id'] : nil, current_account.id )
      end
  end
end