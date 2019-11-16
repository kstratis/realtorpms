module AddRemoveAssociationsHandler
  extend ActiveSupport::Concern

  # Add remove accociation entities based on each request (dropdown selection)
  #
  # @param object [Object] The object in question. i.e. property or user
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
      new_creatable_entries << selection if selection.has_key?('__isNew__')
    end

    # ----
    # The calculated ids to be removed from the object's association
    remove_ids = old_association_ids - (new_entries.map { |entry| entry['value'] })
    # The calculated ids to be added to the object association
    add_ids = (new_entries.map { |entry| entry['value'] }) - old_association_ids

    new_creatable_entries.each do |entry|
      # This takes 'clients' and turns it to Client.create. It then gets its newly created id and appends it to +add_ids+
      add_ids << association.singularize.capitalize.constantize.create(first_name: entry['value'].split(' ').try(:first),
                                                                       last_name: entry['value'].split(' ').try(:second),
                                                                       account: current_account).id
    end

    # Apply the modifications
    # Ref: https://apidock.com/rails/ActiveRecord/Associations/CollectionProxy/delete
    # current_account.send(association).find(id)) could also be written as: association.singularize.capitalize.constantize
    # but I believe it's safer this way even if it ever throws.
    remove_ids.each {|id| object.send(association).delete(current_account.send(association).find(id))} unless remove_ids.blank?
    add_ids.each { |id| object.send(association) << current_account.send(association).find(id) } unless add_ids.blank?

    # This is mainly used to set attributes on the join table (if any).
    block.call(add_ids) if block_given?

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
