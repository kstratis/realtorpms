module Accounts
  class EntityfieldsController < Accounts::BaseController
    def new
      @field = EntityField.new
      respond_to do |format|
        format.js { render 'accounts/entityfields/new' }
      end
    end

    def create

    end

  end
end
