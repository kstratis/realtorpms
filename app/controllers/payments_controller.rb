class PaymentsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def created
    data = JSON.parse(params[:passthrough]).with_indifferent_access
    subdomain = data.values_at(:subdomain)
    event_time = params[:event_time].to_datetime

    account = Account.find_by(subdomain: subdomain)
    account.update({ subscription_status: :active, last_paid_at: event_time })
    head :ok
  end

  def cancelled
    # TODO
    # data = JSON.parse(params[:passthrough]).with_indifferent_access
    # subdomain = data.values_at(:subdomain)
    # event_time = params[:event_time].to_datetime
    #
    # account = Account.find_by(subdomain: subdomain)
    # account.update({ subscription_status: :active, last_paid_at: event_time })
    # head :ok
  end
end