module Accounts
  module Settings
    module Integrations
      class IntegrationsController < Accounts::BaseController
        skip_before_action :verify_authenticity_token
        layout 'settings'

        def index; end

      end
    end
  end
end