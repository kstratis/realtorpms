module Accounts
  class WebsitesController < ApplicationController
    include Pagy::Backend

    before_action { @pagy_locale = I18n.locale }
    before_action :client_website_enabled_or_return

    layout 'client_website/skeleton'

    def index
      @properties = if params_exist?(params)
                      current_account.properties.website_enabled.
                        params_filter(params.slice(:businesstype, :category, :location, :pricemin, :pricemax)).
                        order(created_at: :desc)
                    elsif params[:search] == 'all'
                      current_account.properties.website_enabled.order(created_at: :desc)
                    else
                      current_account.properties.website_enabled.pinned.order(created_at: :desc).limit(3)
                    end
      @pagy, @properties = pagy(@properties)
      @results_label = if request.query_string.present?
                         I18n.t('results')
                       else
                         I18n.t('pinned')
                       end
    end

    def show
      @property = current_account.properties.website_enabled.find(params[:id])
    end

    def count
      properties = current_account.properties.website_enabled.params_filter(params.slice(:businesstype, :category, :location, :pricemin, :pricemax))
      respond_to do |format|
        format.json do
          render json: { status: 'OK', message: I18n.t('properties_count', count: properties.size) }, status: 200
        end
      end
    end

    def params_exist?(params)
      %w[businesstype category location pricemin pricemax].any? { |param| params.has_key?(param) && params[param].present? }
    end

    private

    def render_client_website_unavailable
      respond_to do |format|
        format.html { render :template => "client_website_unavailable", :layout => false, :status => :forbidden }
        format.xml  { head :forbidden }
        format.any  { head :forbidden }
      end
    end

    def client_website_enabled_or_return
      render_client_website_unavailable if current_account.website_enabled.blank?
    end
  end
end

