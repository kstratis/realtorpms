class AccountsController < ApplicationController
  before_action :prompt_account, only: [:new]
  # layout 'registration/main', except: [:show, :edit, :update, :index]  # show the barebones version only when signing up
  layout 'auth/skeleton', only: [:new, :create]  # show the barebones version only when signing up

  def new
    # return redirect_to(account_switch_url) if logged_in?
    return redirect_to root_url(subdomain: nil) unless request.subdomain.blank?
    @account = Account.new
    @account.build_owner
  end

  def create
    @account = Account.new(account_params)
    # @account.owner = Owner.find_or_initialize_by(account_params[:owner_attributes])
    if @account.save
      # @account.users << @account.owner
      log_in(@account.owner)
      flash[:success] = I18n.t('accounts.created', brand: BRANDNAME)
      # redirect_to @account.owner
      redirect_to root_url(subdomain: @account.subdomain)
    else
      # flash.now[:danger] = 'Sorry, your account could not be created.'
      render :new
    end
  end

  def edit
    @account = Account.find_by!(subdomain: request.subdomain)
  end

  # PUT to the edit page
  def update
    @account = Account.find_by!(subdomain: request.subdomain)
    if @account.update_attributes(account_params)
      flash[:success] = I18n.t('accounts.flash.success')
      redirect_to root_url
      # Handle a successful update.
    else
      render :edit
    end
  end

  private

  def account_params
    params.require(:account).permit(:subdomain, :email, :name, :telephones, { owner_attributes: [:first_name, :last_name, :email, :password, :password_confirmation] })
  end
end
