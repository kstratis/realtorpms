class SubscriptionsController < ApplicationController
  layout 'website/skeleton'
  skip_before_action :verify_authenticity_token

  def new; end

  def thankyou; end

  # This is a resource route. No UI
  def create
    # DEBUG
    # puts params
    @user = User.find_by(email: params['email'])
    @account = @user&.owned_accounts&.first
    return head(:bad_request) if @user.blank? || @account.blank?

    @account.update(paid_at: Time.current)
    head :ok
  end
end

