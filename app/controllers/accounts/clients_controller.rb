module Accounts
  class ClientsController < Accounts::BaseController

    def index
      filter_users 'clients'
    end

    def new
      @client = Client.new
      # @client.build_landlord
    end

    def show

    end

  end
end