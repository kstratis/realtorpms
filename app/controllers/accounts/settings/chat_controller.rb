module Accounts
  module Settings
    class ChatController < Accounts::BaseController
      skip_before_action :verify_authenticity_token
      layout 'settings'

      def index; end
    end
  end
end