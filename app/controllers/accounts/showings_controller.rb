module Accounts
  class ShowingsController < Accounts::BaseController
    before_action :find_reference!, except: [:create]
    before_action :find_references!, only: [:create]

    def index
      render json: {status: "OK", message: showings}
    end

    def create
      if current_user.is_admin?(current_account)
        @user = current_account.all_users.find(showing_params[:partner][:value])
      else
        @user = current_user
      end

      @cpa = current_account.cpas.new do |c|
        c.send(@inverted_entity.class.to_s.downcase + '=', @inverted_entity)
        c.send(@entity.class.to_s.downcase + '=', @entity)
        c.user = @user
        c.showing_date = DateTime.parse(showing_params[:dateStr])
        c.viewership = true
        c.ownership = false
        c.comments = showing_params[:comments]
      end

      if @cpa.save
        render json: {status: "OK", message: showings}
      else
        flash[:danger] = I18n.t('viewings.flash_error')
        render json: {status: "Error", message: showings}
      end
    end

    def delete
      current_account.cpas.find(showing_params['showing_id']).destroy
      render json: {status: "OK", message: showings}
    end

    private

      def showings
        showings = Array.new
        entity = params[:originator] # That should either be 'property' or 'client' depending on the page we are reading showings from.
        dbdata = current_account.cpas.where("#{entity}_id = ? AND viewership = ? ", @entity.id, true).includes(entity.to_sym, :user).order(:showing_date)
        is_admin = current_user.is_admin?(current_account)

        dbdata.each do |entry|
          acions_permitted = (is_admin || current_user == entry.try(:user)) ? true : false
          d = get_entity_data(entry, entity, is_admin)
          showings << {
              id: entry.id,
              entity: entity == 'client' ? d.fetch(:name).upcase : d.fetch(:name),
              entity_url: d.fetch(:url, nil),
              user: entry.try(:user).try(:full_name) || '—',
              user_url: entry.try(:user) ? user_path(entry.try(:user)) : '',
              date_string: I18n.l(entry.showing_date, format: :custom),
              comments: entry.comments,
              isAdmin: is_admin,
              canBeDeleted: acions_permitted,
              canViewComments: acions_permitted
          }
        end
        showings
      end

      def get_entity_data(entry, entity, is_admin)
        if entity == 'property'
          user_clients = current_user.clients.where(account: current_account)
          (is_admin || user_clients.include?(entry.try(:client))) ? {name: entry.try(:client).try(:full_name) || '—', url: client_path(entry.try(:client))} : {name: '*****'}
        else
          user_properties = current_user.properties.where(account: current_account)
          (is_admin || user_properties.include?(entry.try(:property))) ? {name: entry.try(:property).try(:slug) || '—', url: property_path(entry.try(:property))} : {name: '*****'}
        end
      end

      def find_reference!
        @entity = current_account.send(params['originator'].pluralize).find(params["#{params['originator']}_id"])
      end

      def find_references!
        find_reference!
        inverted_entity = params['originator'] == 'client' ? 'property' : 'client'
        @inverted_entity = current_account.send(inverted_entity.pluralize).find(params[inverted_entity.to_sym][:value])
      end

      def showing_params
        params.require(:showing).permit({client: [:label, :value]}, {partner: [:label, :value]}, {property: [:label, :value]}, :dateStr, :comments, :property_id, :client_id, :showing_id, :originator)
      end

  end
end
