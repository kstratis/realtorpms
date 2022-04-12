module Accounts
  module Settings
    class SubscriptionsController < Accounts::BaseController
      skip_before_action :verify_authenticity_token
      before_action :set_expiration_date, only: :index

      layout 'settings'

      def new; end

      def index
        return if current_account.active?

        retrieve_checkout_url
      end

      def thankyou; end
      def cancelled; end

      def cancel
        response = cancel_subscription
        return unless response['success'] == false

        flash[:danger] = I18n.t('settings.subscriptions.error_cancelling')
        redirect_to request.referer
      end

      # Resource route. No UI
      def create
        # DEBUG
        # puts params
        @user = User.find_by(email: params['email'])
        @account = @user&.owned_accounts&.first
        return head(:bad_request) if @user.blank? || @account.blank?

        @account.update(paid_at: Time.current)
        head :ok
      end

      private

      def set_expiration_date
        @expiration_date = if current_account.trial?
                             I18n.l(current_account.created_at + 14.days, format: :property)
                           elsif current_account.active?
                             I18n.l(current_account.last_paid_at + 30.days, format: :property)
                           end
      end

      def cancel_subscription
        url = "#{Rails.application.credentials.dig(:paddle, :base_url)}subscription/users_cancel"
        request_body = {
          "vendor_id" => Rails.application.credentials.dig(:paddle, :vendor_id),
          "vendor_auth_code" => Rails.application.credentials.dig(:paddle, :vendor_auth_code),
          "subscription_id" => current_account.subscription_id
        }

        connection = Faraday.new(
          headers: { 'Content-Type' => 'application/x-www-form-urlencoded' },
          ssl: { verify: false }
        )
        response = connection.post(url, request_body)

        JSON.parse(response.body)
      end

      def retrieve_checkout_url
        url = "#{Rails.application.credentials.dig(:paddle, :base_url)}product/generate_pay_link"
        request_body = {
          "vendor_id" => Rails.application.credentials.dig(:paddle, :vendor_id),
          "vendor_auth_code" => Rails.application.credentials.dig(:paddle, :vendor_auth_code),
          "product_id" => Rails.application.credentials.dig(:paddle, :plan_id),
          "passthrough" => { "subdomain" => current_account.subdomain.to_s, "user_email" => current_user.email.to_s }.to_json,
          "customer_email" => current_user.email,
          "return_url" => settings_subscription_completed_path,
          "title" => "RealtorPMS subscription",
          "image_url" => view_context.asset_pack_path('media/images/png_logo.png')
        }
        # 'vendor_id=5206&vendor_auth_code=14d4ccf4f2d54b00a93a259a56cbd9aebe222060c888fc22fe&product_id=&title=&webhook_url=&prices=&recurring_prices=&trial_days=&custom_message=&coupon_code=&discountable=&image_url=&return_url=&quantity_variable=&quantity=&expires=&marketing_consent=&customer_email=&customer_country=&customer_postcode=&is_recoverable=&passthrough=&vat_number=&vat_company_name=&vat_street=&vat_city=&vat_state=&vat_country=&vat_postcode='

        connection = Faraday.new(
          headers: { 'Content-Type' => 'application/x-www-form-urlencoded' },
          ssl: { verify: false }
        )
        response = connection.post(url, request_body)

        parsed_response = JSON.parse(response.body)

        @paddle_checkout_url = parsed_response.dig('response', 'url')
      end

    end
  end
end


