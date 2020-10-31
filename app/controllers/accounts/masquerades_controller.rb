module Accounts
  class MasqueradesController < Accounts::BaseController
    before_action :authorize_admin, only: :new

    def new
      is_active = Membership.find_by(account: current_account, user: params[:user_id]).active
      return redirect_to users_path unless is_active

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

    private

    def authorize_admin
      return if current_user.is_admin?(current_account)

      flash[:danger] = I18n.t "users.flash_owner_only_action"
      redirect_to root_url
    end
  end
end