class SessionsController < ApplicationController
  layout 'registration/main'  # show the barebones version only when signing up/in

  def new
    redirect_to root_url if logged_in?
    unless request.subdomain.blank?
      redirect_to login_url(subdomain: false) unless Account.subdomain_exists?(request.subdomain)
    end
  end

  def create
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      subdomain = get_subdomain(user)
      if subdomain.nil?  # This case is for when user tries to login to an existing subdomain that he/she doesn't belong to
        flash[:danger] = 'Unauthorized domain. Please check your spelling.' # Not quite right!
        redirect_to login_url(subdomain: false)
        # redirect_to login_path
      else
        log_in user
        # note that both 1 and 0 are true in the boolean context. if we had done
        # +params[:session][:remember_me] ? remember(user) : forget(user)+, remeber(user)
        # would always get called
        params[:session][:remember_me] == '1' ? remember(user) : forget(user)
        flash[:success] = 'You have successfully signed in.'

        # redirect_back_or users_path

        redirect_back_or(user, subdomain)

        # redirect_to root_url(subdomain: subdomain)
      end
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
