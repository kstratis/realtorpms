module AddRemoveAssociationsHandler
  extend ActiveSupport::Concern

  # Add remove association entities based on each request (dropdown selection)
  #
  # @param object [Object] The object in question. i.e. user/client
  # @param association [String] The association object. i.e For 'clients' that would be property.send('clients')
  # @param selections [Array] That's an array of objects.
  #   i.e. [{"label"=>"John Smith", "value"=>36}, {"label"=>"Jane Stevens", "value"=>"Jane Stevens", "__isNew__"=>true}],
  # @return [Array] The new merged and sorted collection of objects.
  def associations_handler(object, association, selections, &block)
    # Fetch all existing associations. We can't use pluck here since it will alter the query which is something we can't
    # do since we are already using a custom scope.
    old_association_ids = object.send(association).map(&:id)

    new_entries, new_creatable_entries = [], []
    selections.each do |selection|
      new_entries << selection unless selection.has_key?('__isNew__')
      # TODO; Dead code. Remove.
      new_creatable_entries << selection if selection.has_key?('__isNew__')
    end

    # ----
    # The calculated ids to be removed from the object's association
    remove_ids = old_association_ids - (new_entries.map { |entry| entry['value'] })
    # The calculated ids to be added to the object association
    add_ids = (new_entries.map { |entry| entry['value'] }) - old_association_ids

    new_creatable_entries.each do |entry|
      # This would take 'clients' and turn it to Client so we can call +create+ on it. It then gets its newly created id
      # and appends it to +add_ids+. This wouldn't work for +users+ of course since it uses a join table for its model
      # type but that's fine since we don't -ever- create new system users from a dropdown. Remember that the user
      # dropdown in PropertiesController#show is not creatable.
      newly_created_object = current_account.send(association).create(first_name: entry['value'].split(' ').try(:first) || '-',
                                                          last_name: entry['value'].split(' ').try(:second) || '-',
                                                          model_type: current_account.model_types.find_by(name: association),
                                                          account: current_account)

      if current_user.role(current_account) == 'user'
         current_user.send(association).push(newly_created_object)
      end

      add_ids << newly_created_object.id

    end
    # Apply the modifications
    # Ref: https://apidock.com/rails/ActiveRecord/Associations/CollectionProxy/delete
    # current_account.send(association).find(id)) could also be written as: association.singularize.capitalize.constantize
    # but I believe it's safer this way even if it ever throws.
    remove_ids.each { |id| object.send(association).delete(current_account.send(association).find(id)) } unless remove_ids.blank?
    unless add_ids.blank?
      add_ids.each do |id|
        object.send(association) << current_account.send(association).find(id)

        # Notifications part. Use slug for properties, full name for clients
        entity_name = object.instance_of?(Property) ? object.slug.upcase : object.full_name
        entity_path = object.instance_of?(Property) ? property_path(object) : client_path(object)

        # This handler is being used in the following situations:
        # - `client.users` (assigns clients to partners) - Send Notification
        # - `property.users` (assigns properties to partners) - Send Notification
        # - `property.clients` (assigns clients to properties) - Do not send notifications
        # The association is the plural form (users/clients). This effectively means that it only makes sense to send
        # a notification to a partner when we assign him a property or a client. The third case (assign clients to properties)
        # does not make sense for a notification as clients are not system users,
        if association == 'users'
          recipient = current_account.users.find(id)
          if recipient.role(current_account) == 'user'
            Accounts::Notifications::PropertyAssignNotification.
              with(payload: I18n.t("assignments.notifications.#{object.class.to_s.pluralize.downcase}_html",
                                   entity_name: entity_name, entity_path: entity_path),
                   account: current_account).
              deliver(recipient)
          end
        end
      end
      #add_ids.each { |id| current_account.cpas.create(property_id: object.id, client_id: current_account.send(association).find(id).id, account_id: current_account) }

      # This is mainly used to set attributes on the join table (if any).
      block.call(add_ids) if block_given?
    end

    object.reload

    data = Array.new

    object.send(association).each do |entry|
      hash = {
        label: "#{entry.first_name} #{entry.last_name}",
        value: entry.id
      }
      data << hash
    end

    data

  end
end
