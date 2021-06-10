class AccountMailer < ApplicationMailer

  def account_confirmation(account)
    @user = account.owner
    @account = account
    mail to: @user.email, subject: "Account activation"
  end

end