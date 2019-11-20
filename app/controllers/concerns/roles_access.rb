module RolesAccess
  extend ActiveSupport::Concern

  def admin_access
    unless current_user.is_admin?(current_account)
      flash[:danger] = I18n.t('access_denied')
      redirect_to root_path
    end
  end
end
