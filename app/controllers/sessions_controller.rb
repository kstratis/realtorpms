class SessionsController < ApplicationController
  layout 'registration/main'  # show the barebones version only when signing up/in

  def new
    redirect_to root_url if logged_in?
  end

  def create
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      log_in user
      # note that both 1 and 0 are true in the boolean context. if we had done
      # +params[:session][:remember_me] ? remember(user) : forget(user)+, remeber(user)
      # would always get called
      params[:session][:remember_me] == '1' ? remember(user) : forget(user)
      flash[:success] = 'You have successfully signed in.'
      redirect_back_or user
    else
      flash.now[:danger] = 'Invalid email/password combination' # Not quite right!
      render 'new'
    end
  end

  def destroy
    log_out if logged_in?
    flash[:danger] = 'You have successfully signed out.'
    redirect_to root_url
  end

end
