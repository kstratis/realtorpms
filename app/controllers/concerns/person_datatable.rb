module PersonDatatable
  extend ActiveSupport::Concern
  include Cfields
  include Utilities

  SORT_FILTERS = %w(last_name email created_at)

  def filter_persons(relation, filters = {})
    if filters[:page]
      param = Integer(filters[:page]) rescue nil
      unless param.is_a? Integer
        render_404 and return
      end
    end

    @persons = relation
    # if current_user.is_admin?(current_account)
    #   @persons = current_account.send(entity)
    # else
    #   current_user.send(entity)
    # end

    if filters[:search]
      @persons = @persons.search(filters[:search], nil, filters[:dropdown].blank? ? nil : 5)
    end

    ####################
    # This is for retrieving the users list from within react-select
    if filters[:dropdown]
      data = Array.new
      @persons.each do |entry|
        hash = {
            label: "#{entry.first_name} #{entry.last_name}",
            value: entry.id
        }
        data << hash
      end
      render :json => {:status => "OK", :message => data} and return
    end
    ####################

    if @persons.klass.to_s.pluralize.downcase != 'clients'
      if filters[:status]
        @persons = @persons.joins(:memberships).where(memberships: {active: true?(filters[:status])})
      else
        @persons = @persons.joins(:memberships).where(memberships: {active: true})
      end
    end

    # Custom fields filtering
    @persons, initial_cfields = cfields_filtering(@persons.klass.to_s.pluralize.downcase, @persons, filters)

    if filters[:sorting] && filters[:ordering]
      if filters['sorting'] == 'assignments_count'
        @persons = @persons.left_outer_joins(:assignments).group(:id).order("count(assignments.user_id) #{filters[:ordering]}, last_name DESC")
      else
        @persons = @persons.order("#{filters[:sorting]}": filters[:ordering]) if SORT_FILTERS.include?(filters[:sorting])
      end
    else
      @persons = @persons.order(created_at: :desc)
    end

    @persons = @persons.paginate(page: filters[:page], :per_page => 10)
    # @persons = User.paginate(page: filters[:page], :per_page => 10)
    @personslist = {:dataset => Array.new}
    # All the data we need - SOS
    # puts @users.total_entries # total user entries
    # puts @users.total_pages # page count
    # puts @users.current_page # current page
    @persons.each do |entry|
      hash = {
          id: entry.id,
          # avatar_url: helpers.gravatar_for(entry, size: 64, link_only: true),
          avatar: {url: render_avatar(entry, nil, nil, true), usercolor: entry.try(:color) || '#404E5C'},
          # name: "#{entry.try(:first_name).try(:first)}. #{entry.try(:last_name)}",
          name: "#{entry.try(:first_name)} #{entry.try(:last_name)}",
          email: entry.try(:email) || '—',
          type: entry.try(:role, current_account) || nil,
          # active: entry.active?,
          same_user: entry.instance_of?(User) ? entry.id == current_user.id : nil,
          active: entry.instance_of?(User) ? Membership.find_by(account: current_account, user: entry).active : nil,
          privileged: entry.instance_of?(User) ? Membership.find_by(account: current_account, user: entry).privileged : nil,
          view_entity_path: polymorphic_path([entry.class.to_s.downcase.to_sym], id: entry.id),
          edit_entity_path: polymorphic_path([entry.class.to_s.downcase.to_sym], id: entry.id, action: :edit),
          masquerade_path: entry.instance_of?(User) ? user_masquerade_new_path(entry.id) : nil,
          telephones: retrieve_telephone(entry),
          # assignments: entry.properties.count,
          # registration: entry.created_at.to_formatted_s(:long)
          # registration: entry.created_at.strftime('%d %b. %y'),
          registration: l(entry.created_at, format: :showings),
          is_assigned: @property ? @property.users.exists?(entry.id) : nil,
          assignments_count: @property ? entry.properties.count : nil,
          # property_id: property ? property.id : nil
      }
      hash[:agent] = I18n.t(entry.try(:agent?)) if entry.class.to_s == 'Client'
      @personslist[:dataset] << hash
    end
    # The following entries are only for the first render
    @total_entries = @persons.total_entries
    @current_page = @persons.current_page
    @results_per_page = 10
    @meta = {is_admin: current_user.is_admin?(current_account)}

    @initial_search = filters[:search] || ''
    @initial_sorting = filters[:sorting] || 'created_at'
    @initial_ordering = filters[:ordering] || 'desc'
    @initial_purpose = filters[:status] || 'true'
    @initial_cfields = initial_cfields

    respond_to do |format|
      format.html
      format.json {render json: {results_per_page: @results_per_page,
                                 datalist: @personslist,
                                 total_entries: @persons.total_entries,
                                 current_page: @persons.current_page}, status: 200}
    end
  end

  def get_total_properties
    properties.count
  end

  private

  def retrieve_telephone(entry)
    if entry.instance_of?(User)
      entry.try(:phone1) || entry.try(:phone2) || '-'
    else
      entry.telephones.present? ? print_telephone(entry.telephones, current_account) : '—'
    end
  end
end