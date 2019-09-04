module Accounts
  class InvitationsController < Accounts::BaseController
    before_action :authorize_owner!

    def new
      @invitation = Invitation.new
    end

    # Make sure the user an account owner is inviting is not already a member of his domain
    def check_existing_user
      user = current_account.all_users.find_by(email: params[:email])
      render json: {status: "Checked" }, status: user.nil? ? 200 : 403
    end

    def create
      @invitation = current_account.invitations.find_or_initialize_by(invitation_params)
      # If the invitation is sent anew, force update its updated_at timestamp. Otherwise (first-time created, do nothing)
      @invitation.touch unless @invitation.new_record?
      respond_to do |format|
        if @invitation.save
          # Send out the email
          InvitationMailer.invite(@invitation).deliver_now
          format.js { render 'shared/ajax/handler',
                             locals: {resource: @invitation,
                                      action: 'created',
                                      partial_success: 'shared/ajax/success',
                                      partial_failure: 'shared/ajax/failure'} }
          format.html do
            flash[:success] = I18n.t "invitations.created.no_js_success", email: @invitation.email
            redirect_to users_path
          end
        else
          format.js { render 'shared/ajax/handler',
                             locals: {resource: @invitation,
                                      action: 'created',
                                      partial_success: 'shared/ajax/success',
                                      partial_failure: 'shared/ajax/failure'} }
          format.html do
            flash.now[:danger] = I18n.t "accounts.switch_domain", subdomain: request.subdomain
            render :new
          end

        end
      end
    end

    private

      # Only account owners may invite users
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
