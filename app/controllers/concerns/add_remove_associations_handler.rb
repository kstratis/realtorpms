module AddRemoveAssociationsHandler
  extend ActiveSupport::Concern

  # Add remove accociation entities based on each request (dropdown selection)
  #
  # @param object [Object] The object in question. i.e. property, user
  # @param association [String] The association object. i.e For 'clients' that would be property.send('clients')
  # @param selection [Array] That's an array of objects.
  #   i.e. [{"label"=>"John Smith", "value"=>36}, {"label"=>"Jane Stevens", "value"=>"Jane Stevens", "__isNew__"=>true}],
  # @return [Array] The new merged and sorted collection of objects.
  def associations_handler(object, association, selection)
    puts 'handler working'
    puts "object is: #{object.inspect}"
    # Fetch all existing associations
    existing_associations = object.send(association).map(&:id)

    # ----

    # Normalize the data to an array
    requested_user_assignments = ru.map(&:to_h).map { |hash| hash['value'] }

    # The calculated user ids to be remove from the property
    remove_ids = existing_associations - requested_user_assignments
    # The calculated user ids to be added to the property
    add_ids = requested_user_assignments - existing_user_assignments


  end
end
