module Accounts
  # We don't inherit from Accounts::BaseController cause we need to skip all checks at this point
  class ConfirmationsController < ApplicationController

    layout 'auth/skeleton'

    def confirm_email
      @account = Account.find_by_confirm_token(params[:token])
      if @account
        @account.email_activate
        log_in(@account.owner)
        respond_to do |format|
          format.html
        end
      else
        flash[:error] = "Wrong token"
        redirect_to landing_root_url(locale: I18n.locale)
      end
    end

  end
end

