module Accounts
  class WebsitesController < ApplicationController
    include Pagy::Backend

    before_action { @pagy_locale = I18n.locale }

    layout 'client_website/skeleton'

    def index
      @properties = if params_exist?(params)
                      current_account.properties.website_enabled.params_filter(params.slice(:businesstype, :category, :location)).order(created_at: :desc)
                    else
                      current_account.properties.website_enabled.order(created_at: :desc).limit(3)
                    end
      @pagy, @properties = pagy(@properties)
    end

    def count
      properties = current_account.properties.website_enabled.params_filter(params.slice(:businesstype, :category, :location))
      respond_to do |format|
        format.json do
          render json: { status: 'OK', message: I18n.t('properties_count', count: properties.size) }, status: 200
        end
      end
    end

    def params_exist?(params)
      %w[businesstype category location].any? { |param| params.has_key?(param) && params[param].present? }
    end

    # def search
    #   puts params
    #   @properties = current_account.properties.order(:id).all
    #   respond_to do |format|
    #     format.html
    #     format.json do
    #       render json: { entries: render_to_string(partial: "properties", formats: [:html]) }
    #     end
    #   end
    # end
  end
end

