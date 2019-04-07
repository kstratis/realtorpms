class AccountsController < ApplicationController
  # layout 'registration/main', except: [:show, :edit, :update, :index]  # show the barebones version only when signing up
  layout 'registration/main'  # show the barebones version only when signing up

  def new
    @account = Account.new
    @account.build_owner
  end

  def create
    @account = Account.new(account_params)
    if @account.save
      # @account.users << @account.owner
      # log_in(@account.owner)
      puts 'SIGNING IN'
      sign_in(@account.owner)
      puts 'SHOULD HAVE SIGNED IN BY NOW'
      flash[:success] = 'Welcome to PropertyX! Your account has been successfully created.'
      puts 'FLASH MESSAGE SHOULD BE SET'
      # redirect_to @account.owner
      redirect_to root_url(subdomain: @account.subdomain)
    else
      flash.now[:danger] = 'Sorry, your account could not be created.'
      render :new
    end
  end

  # POST to the edit page
  def update
    @user = User.find(params[:id])
    if @user.update_attributes(user_params)
      flash[:success] = 'Your profile was successfully updated'
      redirect_to @user
      # Handle a successful update.
    else
      render 'edit'
    end
  end

  private

  def account_params
    params.require(:account).permit(:subdomain, { owner_attributes: [:first_name, :last_name, :email, :age, :phone1, :password, :password_confirmation] })
  end
end
