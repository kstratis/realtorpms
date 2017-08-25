module Accounts
  class InvitationsController < Accounts::BaseController
    before_action :authorize_owner!

    def new
      @invitation = Invitation.new
    end

    def create
      @invitation = current_account.invitations.new(invitation_params)
      if @invitation.save
        flash[:success] = "#{@invitation.email} has been successfully invited."
        redirect_to users_path
      else
        # this merely re-renders the new template.
        # It doesn't fully redirect (in other words it doesn't go through the +new+ method)
        flash.now[:danger] = 'Invalid email' # Not quite right!
        render 'new'
      end
    end

    private
      def authorize_owner!
        unless owner?
          flash[:danger] = 'Only an account\'s owner can perform such action.'
          redirect_to root_url(subdomain: current_account.subdomain)
        end
      end

      def invitation_params
        params.require(:invitation).permit(:email)
      end

    end
  end
