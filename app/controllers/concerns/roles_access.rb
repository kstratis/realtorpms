module RolesAccess
  extend ActiveSupport::Concern

  def admin_access_ajax
    render json: {status: I18n.t('error'), message: I18n.t('action_not_permitted_error')},
           status: 403 unless current_user.is_admin?(current_account)
  end

  def admin_access
    unless current_user.is_admin?(current_account)
      flash[:danger] = I18n.t('action_not_permitted_error')
      redirect_to root_path
    end
  end

end
