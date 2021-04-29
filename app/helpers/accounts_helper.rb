module AccountsHelper
  def redirect_to_app_url
    user_accounts = current_user.all_accounts
    if user_accounts.present? && user_accounts.size == 1
      account_root_url(subdomain: user_accounts.first.subdomain)
    else
      account_list_url(subdomain: nil)
    end
  end
end