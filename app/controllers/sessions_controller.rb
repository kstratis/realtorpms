class SessionsController < ApplicationController
  layout 'registration/main'  # show the barebones version only when signing up/in

  def new
    redirect_to root_url if logged_in?
    # This is used in case a users attempts to access a subdomain that doesn't exist
    unless request.subdomain.blank?
      redirect_to login_url(subdomain: false) unless Account.subdomain_exists?(request.subdomain)
    end
  end

  def create

    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      # Special case accepting invitations
      # ----------------------------------
      app_logger.info("-=HELLO WORLD=-")

      if session.key?('forwarding_url') && /\/invitations\/\w+\/accept/.match(session[:forwarding_url])
        log_in user
        # note that both 1 and 0 are true in the boolean context. if we had done
        # +params[:session][:remember_me] ? remember(user) : forget(user)+, remeber(user)
        # would always get called
        params[:session][:remember_me] == '1' ? remember(user) : forget(user)
        # flash[:success] = 'You have successfully signed in.'
        # redirect_to login_url(subdomain: false)
        redirect_to build_redirection_url(URI.parse(session[:forwarding_url]), nil) and return
      end
      # ----------------------------------

      # Log in with a given subdomain in URL - No ambiguity
      unless request.subdomain.blank? # if subdomain exists in url
        app_logger.warn("-=this should never print=-")



        account = Account.find_by_subdomain!(request.subdomain) # get account or 404
        unless account.owner == user || account.users.exists?(user.id)
          render_401 and return
        end
        log_in user
        params[:session][:remember_me] == '1' ? remember(user) : forget(user)
        flash[:success] = 'You have successfully signed in.'

        redirect_back_or(nil, request.subdomain) and return
      end

      # Log in without a subdomain in URL. This can only happen in root/login path.
      # All other routes are automatically protected with a subdomain constraint.
      log_in user
      params[:session][:remember_me] == '1' ? remember(user) : forget(user)
      flash[:success] = 'You have successfully signed in.'
      # Check the account count. If accounts.count > 0 redirect to account switcher
      # otherwise simply redirect the user to his/her default subdomain
      # puts total_accounts(user)
      # user_accounts_count = user.accounts.count
      #
      #
      app_logger.debug("-=game on=-")
      app_logger.debug("-=user account count is: #{user.get_account_count}=-")


      redirect_to account_list_url(subdomain: false) and return if user.get_account_count > 1
      unless user.has_owning_accounts?.zero?
        redirect_to root_url(subdomain: Account.find_by(owner_id: user.id).subdomain) and return
      end
      redirect_to root_url(subdomain: user.accounts.first!.subdomain)

      # redirect_to root_url(subdomain: user.accounts.first!.subdomain)


      # unless user_accounts_count == 0
      #   if user_accounts_count > 1
      #     redirect_to account_list_url(subdomain: false) and return
      #   else
      #     redirect_to root_url(subdomain: user.accounts.first!.subdomain) and return
      #   end
      # end
      # puts "inside outer"
      # redirect_to root_url(subdomain: Account.find_by(owner_id: user.id).subdomain)

    else
      flash.now[:danger] = 'Invalid email/password combination' # Not quite right!
      render 'new'
    end
  end

  def destroy
    log_out if logged_in?
    flash[:danger] = 'You have successfully signed out.'
    redirect_to root_url(subdomain: request.subdomain) # make the subdomain explicit
  end

end
