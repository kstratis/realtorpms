module Accounts
  class InvitationsController < Accounts::BaseController
    # skip_before_action :logged_in_user, :correct_subdomain, only: [:accept, :accepted]
    # skip_before_action :logged_in_user, only: [:accept, :accepted]
    # before_action :authorize_owner!, except: [:accept, :accepted]
    before_action :authorize_owner!

    def new
      @invitation = Invitation.new
    end

    def create
      @invitation = current_account.invitations.new(invitation_params)
      respond_to do |format|
        if @invitation.save
          # Send out the email
          InvitationMailer.invite(@invitation).deliver_now
          format.html do
            flash[:success] = "#{@invitation.email} has been successfully invited."
            redirect_to users_path
          end
          format.js {render :create_result}
        else
          format.html do
            flash.now[:danger] = I18n.t "accounts.switch_domain", subdomain: request.subdomain
            render :new
          end
          format.js {render :create_result}
        end
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
