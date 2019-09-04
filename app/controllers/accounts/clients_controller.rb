module Accounts
  class ClientsController < Accounts::BaseController

    def index
      current_account.clients.all
    end

  end
end