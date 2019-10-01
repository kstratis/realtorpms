module TimelineHelper
  def render_timeline_header(entry)
    return '' if entry.blank?
    entities = {
        users: I18n.t('main.timeline.users', author: entry.try(:author_name)),
        properties: I18n.t('main.timeline.properties', author: entry.try(:author_name)),
        clients: I18n.t('main.timeline.clients', author: entry.try(:author_name)),
    }
    entities[entry.try(:entity).try(:to_sym)]
  end

  def render_action(entry)
    return '' if entry.blank?
    actions = {
        create: I18n.t('main.timeline.create_html', entity_url: render_entity_url(entry), entity_label: I18n.t("main.timeline.#{entry.try(:entity).try(:singularize)}")),
        update: entry.try("#{entry.try(:entity).try(:to_s).try(:singularize)}_id".try(:to_sym)) ? I18n.t('main.timeline.update_existing_html', entity_url: render_entity_url(entry), entity_label: render_entity_label(entry, 'update')) : I18n.t('main.timeline.update_deleted_html', entity_url: render_entity_url(entry), entity_label: render_entity_label(entry, 'update')),
        destroy: I18n.t('main.timeline.destroy_html', entity_url: render_entity_url(entry), entity_label: render_entity_label(entry, 'destroy')),
        accepted: I18n.t('main.timeline.create_html', entity_url: render_entity_url(entry), entity_label: I18n.t("main.timeline.#{entry.try(:entity).try(:singularize)}")),
    }
    actions[entry.try(:action).try(:to_sym)]
  end

  def render_entity_url(entry)
    # DEBUG
    # puts entry.inspect
    entity_id = entry.try("#{entry.try(:entity).try(:to_s).try(:singularize)}_id".try(:to_sym))
    association = entry.try(:entity).try(:downcase)
    association = 'all_users' if association == 'users' # Needs to search the current user himself who may be an owner
    unless entity_id.blank?
      return polymorphic_path(current_account.send(association).find(entity_id))
    end
    nil
  end

  def render_entity_label(entry, action)
    label = entry.try("#{entry.try(:entity).try(:singularize)}_name".try(:to_sym))
    if entry.try(:entity).try(:singularize) == 'property' && %w(update destroy).include?(action)
      return label.upcase
    end
    label
  end
end