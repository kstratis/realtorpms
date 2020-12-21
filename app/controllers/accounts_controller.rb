class AccountsController < ApplicationController
  before_action :prompt_account, only: [:new]
  layout 'auth/skeleton', only: [:new, :create] # show the barebones version only when signing up

  # GET the new page
  def new
    return redirect_to root_url(subdomain: nil) unless request.subdomain.blank?
    @account = Account.new
    @account.build_owner
  end

  # POST to the new page
  def create
    @account = Account.new(account_params)

    respond_to do |format|
      if @account.save
        @owner_email = @account.owner.email
        @account.model_types.find_by(name: 'users').users << @account.owner
        AccountMailer.account_confirmation(@account).deliver

        # flash[:success] = "Please confirm your email address to continue"
        # redirect_to root_url(subdomain: @account.subdomain)
        # redirect_to account_created_url(subdomain: @account.subdomain)

        # log_in(@account.owner)
        # flash[:success] = I18n.t('accounts.created', brand: BRANDNAME)
        # redirect_to root_url(subdomain: @account.subdomain)
        # format.html
        format.html { render :created }

      else
        flash.now[:error] = "Error creating account"

        format.html { render :new }
      end
    end
  end

  # GET the edit page
  def edit
    @account = Account.find_by!(subdomain: request.subdomain)
  end

  # PUT to the edit page
  def update
    @account = Account.find_by!(subdomain: request.subdomain)
    if @account.update_attributes(account_params)
      flash[:success] = I18n.t('accounts.flash.success')
      redirect_to root_url
    else
      # Before we get to this we already have js validation in place
      render :edit
    end
  end

  private

  def account_params
    params.require(:account).permit(:subdomain,
                                    :website,
                                    :name,
                                    :email,
                                    :telephones,
                                    :address, { owner_attributes:
                                                  [:first_name,
                                                   :last_name,
                                                   :email,
                                                   :password,
                                                   :password_confirmation] })
  end
end
