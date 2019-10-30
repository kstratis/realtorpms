module PersonDatatable
  extend ActiveSupport::Concern
  include Cfields
  include Utilities

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
      @persons = @persons.search(filters[:search])
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
    @persons, initial_cfields = cfields_filtering('users', @persons, filters)

    if filters[:sorting] && filters[:ordering]
      if filters['sorting'] == 'assignments_count'
        # query = 'SELECT u.*, count(a.user_id) AS total_assignments FROM users AS u JOIN assignments AS a ON a.user_id = u.id GROUP BY u.id ORDER BY total_assignments;'
        # query = 'SELECT u.* FROM "users" AS u JOIN "assignments" AS a ON a.user_id = u.id GROUP BY u.id ORDER BY count(a.user_id);'

        @persons = @persons.left_outer_joins(:assignments).group(:id).order("count(assignments.user_id) #{filters[:ordering]}, last_name DESC")
        # @persons = @persons.find_by_sql(query)
        # byebug
        # @persons = @persons.order("count('assignments')")
        # @persons = @persons.sort_by(&:get_total_properties)

        # @persons = User.sorted_by_assignments_count(@persons)
        # @persons = User.sorted_by_assignments_count(@persons)
      else
        @persons = @persons.order("#{filters[:sorting]}": filters[:ordering])
      end
      # @persons = @persons.order("#{filters[:sorting]}": filters[:ordering])
    else
      @persons = @persons.order(:created_at)
    end


    # if filters[:sorting] && filters[:ordering]
    #   @properties = @properties.order("#{filters[:sorting]}": filters[:ordering])
    # else
    #   @properties = @properties.order(created_at: 'desc')
    # end



    # puts @persons.to_yaml

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
          name: "#{entry.try(:first_name).try(:first)}. #{entry.try(:last_name)}",
          email: entry.try(:email) || '—',
          type: entry.try(:role, current_account) || nil,
          # active: entry.active?,
          active: entry.class == User ? Membership.find_by(account: current_account, user: entry).active : nil,
          view_entity_path: polymorphic_path([entry.class.to_s.downcase.to_sym], id: entry.id),
          edit_entity_path: polymorphic_path([entry.class.to_s.downcase.to_sym], id: entry.id, action: :edit),
          telephones: entry.try(:telephones) || '—',
          # assignments: entry.properties.count,
          # registration: entry.created_at.to_formatted_s(:long)
          # registration: entry.created_at.strftime('%d %b. %y'),
          registration: l(entry.created_at, format: :regular),
          is_assigned: @property ? @property.users.exists?(entry.id) : nil,
          assignments_count: @property ? entry.properties.count : nil,
          # property_id: property ? property.id : nil
      }
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
end