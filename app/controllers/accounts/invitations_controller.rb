module Accounts
  class InvitationsController < Accounts::BaseController
    skip_before_action :logged_in_user, :correct_subdomain, only: [:accept, :accepted]
    before_action :authorize_owner!, except: [:accept, :accepted]

    def new
      @invitation = Invitation.new
    end

    def accept
      @invitation = Invitation.find(params[:id])
      @user = User.new
    end

    def accepted
      puts 'accepted is firing'
      @invitation = Invitation.find(params[:id])
      user_params = params[:user].permit(
          :email,
          :first_name,
          :last_name,
          :password,
          :password_confirmation
      )
      # +create!+ is an active record method not a users controller one
      user = User.create!(user_params)
      current_account.users << user
      log_in(user)
      puts "current_account.subdomain is #{current_account.subdomain}"
      # redirect_to root_url
      flash[:success] = "You have joined the #{current_account.subdomain} account."
      puts "the redirect will be on: #{root_url(subdomain: current_account.subdomain)}"
      redirect_to root_url(subdomain: current_account.subdomain)
    end

    def create
      # @invitation = current_account.invitations.new(invitation_params)
      # @invitation.save
      # InvitationMailer.invite(@invitation).deliver_later
      # flash[:notice] = "#{@invitation.email} has been invited."
      # redirect_to root_path

      @invitation = current_account.invitations.new(invitation_params)
      if @invitation.save
        # This actually sends out the email
        InvitationMailer.invite(@invitation).deliver_now
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
