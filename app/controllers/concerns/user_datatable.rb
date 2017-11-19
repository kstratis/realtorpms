module UserDatatable
  def print_users
    if params[:page]
      param = Integer(params[:page]) rescue nil
      unless param.is_a? Integer
        render_404 and return
      end
    end

    @users = User.all

    if params[:search]
      @users = @users.search(params[:search])
    end

    if params[:sorting] && params[:ordering]
      @users = @users.order("#{params[:sorting]}": params[:ordering])
    else
      @users = @users.order(:created_at)
    end

    # puts @users.to_yaml

    @users = @users.paginate(page: params[:page], :per_page => 10)
    # @users = User.paginate(page: params[:page], :per_page => 10)
    @userslist = {:dataset => Array.new}
    # All the data we need - SOS
    # puts @users.total_entries # total user entries
    # puts @users.total_pages # page count
    # puts @users.current_page # current page
    @users.each do |user|
      hash = {
          id: user.id,
          avatar_url: helpers.gravatar_for(user, size: 64, link_only: true),
          name: "#{user.first_name.first}. #{user.last_name}",
          email: user.email,
          type: user.admin ? 'Admin' : 'User',
          view_entity_path: user_path(user.id),
          edit_entity_path: edit_user_path(user.id),
          # assignments: user.properties.count,
          # registration: user.created_at.to_formatted_s(:long)
          registration: user.created_at.strftime('%d %b. %y'),
          is_assigned: @property ? @property.users.exists?(user.id) : nil,
          assignments_count: @property ? user.properties.count : nil,
          # property_id: property ? property.id : nil
      }
      @userslist[:dataset] << hash
    end
    # The following entries are only for the first render
    @total_entries = @users.total_entries
    @current_page = @users.current_page
    @results_per_page = 10
    @initial_search = params[:search] || ''
    @initial_sorting = params[:sorting] || 'created_at'
    @initial_ordering = params[:ordering] || 'desc'

    respond_to do |format|
      format.html
      format.json {render json: {results_per_page: @results_per_page,
                                 userslist: @userslist,
                                 total_entries: @users.total_entries,
                                 current_page: @users.current_page}, status: 200}
    end
  end
end