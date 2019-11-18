module ForbiddenIds
  extend ActiveSupport::Concern

  def forbidden_entity_ids(entities)
    unless current_user.is_admin?(current_account)
      return current_account.send(entities).where.not(id: current_user.send(entities).where(account: current_account)).pluck(:id)
    end
    []
  end
end
