module ForbiddenIds
  extend ActiveSupport::Concern

  def forbidden_ids
    unless current_user.is_admin?(current_account)
      return current_account.properties.where.not(id: current_user.properties.where(account: current_account).includes(:location, :landlord)).pluck(:id)
    end
    []
  end
end
