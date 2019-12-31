module Accounts
  class ShowingsController < Accounts::BaseController
    def index
      @property = current_account.properties.find(params['property_id'])
      viewings = Array.new
      dbdata = Cpa.where(property: @property, viewership: true).includes(:client, :user)
      dbdata.each do |entry|
        viewings << {
            id: entry.id,
            client: (current_user.is_admin?(current_account) || current_user.clients.include?(entry.try(:client))) ? (entry.try(:client).try(:full_name) || '—') : '*****',
            user: entry.try(:user).try(:full_name) || '—',
            date_string: I18n.l(entry.created_at, format: :custom)
        }
      end
      render json: {status: "OK", message: viewings}
    end

    def create
      puts params
    end
  end
end
