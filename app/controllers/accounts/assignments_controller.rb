module Accounts
  class AssignmentsController < Accounts::BaseController
    before_action :authorize_owner_rest!

    def create
      property = Property.find(params[:pid])
      user = User.find(params[:uid])

      # prop
      property.users << user

      respond_to do |format|
        # msg = { :status => 200, :message => "Success!", :html => "<b>...</b>" }
        # format.html {redirect_to root_url(subdomain: current_account.subdomain), notice: 'Only an account\'s owner can perform such action.'}
        # format.json  { render json: msg } # don't do msg.to_json
        format.json {render json: {message: 'User successfully added'}, status: 200}

      end
      # respond_to do |format|

        # format.html
        # format.json {render json: {message: 'all good'}, status: 200}
      # end
      # puts user_params
    end

    def destroy
      property = Property.find(params[:pid])
      user = User.find(params[:uid])
      Assignment.find_by(property_id: property, user_id: user).destroy
      respond_to do |format|
        # msg = { :status => 200, :message => "Success!", :html => "<b>...</b>" }
        # format.html {redirect_to root_url(subdomain: current_account.subdomain), notice: 'Only an account\'s owner can perform such action.'}
        # format.json  { render json: msg } # don't do msg.to_json
        format.json {render json: {message: 'User successfully removed'}, status: 200}
      end
    end

    private
      def authorize_owner_rest!
        unless owner?
          respond_to do |format|
            # format.html {redirect_to root_url(subdomain: current_account.subdomain), notice: 'Only an account\'s owner can perform such action.'}
            format.json {render json: {message: 'Forbidden'}, status: 403 }
          end
            # flash[:danger] = 'Only an account\'s owner can perform such action.'
            # redirect_to root_url(subdomain: current_account.subdomain)
        end
      end
  end
end


