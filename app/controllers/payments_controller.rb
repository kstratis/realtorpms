class PaymentsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def handler
    @alert_name = params[:alert_name]

    case @alert_name
    when 'subscription_created'
      created
    when 'subscription_cancelled'
      cancelled
    else
      head :ok
    end
  end

  private

  def created
    data = JSON.parse(params[:passthrough]).with_indifferent_access
    subdomain = data.values_at(:subdomain)
    event_time = params[:event_time].to_datetime
    subscription_id = params[:subscription_id]

    account = Account.find_by(subdomain: subdomain)
    account.update({ subscription_status: :active, last_paid_at: event_time, subscription_id: subscription_id })
    head :ok
  end

  def cancelled
    data = JSON.parse(params[:passthrough]).with_indifferent_access
    subdomain = data.values_at(:subdomain)
    subscription_id = params[:subscription_id]

    account = Account.find_by(subdomain: subdomain, subscription_id: subscription_id)
    if account.present?
      account.update({ subscription_status: :cancelled })
    end
    head :ok
  end
end