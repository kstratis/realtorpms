module Accounts
  class MasqueradesController < Accounts::BaseController
    # before_filter :authorize, :authorize_admin

    def new
      session[:admin_id] = current_user.id
      user = User.find(params[:user_id])
      log_in(user)
      redirect_to root_path, notice: "Now masquerading as #{user.full_name}"
    end

    def destroy
      user = User.find(session[:admin_id])
      log_in(user)
      session[:admin_id] = nil
      redirect_to users_path, notice: "Stopped masquerading"
    end
  end
end