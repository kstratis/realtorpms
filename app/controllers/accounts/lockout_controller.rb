module Accounts
  # We don't inherit from Accounts::BaseController cause we need to skip all checks at this point
  class LockoutController < ApplicationController
    before_action :activated?

    layout 'lockout'

    def show
      respond_to do |format|
        format.html { render 'accounts/deactivated', locals: { redirection: 'in.gr' } }
      end
    end

    private

    def activated?
      return redirect_to login_url unless logged_in?

      redirect_to root_path if current_account.email_confirmed? || current_user.is_sysadmin? || sys_admin_masquerading?
    end

  end
end

