class AccountMailer < ApplicationMailer

  def account_confirmation(account)
    @user = account.owner
    @account = account
    mail to: @user.email, subject: "Account activation"
  end

  # def password_reset(user, subdomain)
  #   @user = user
  #   @subdomain = subdomain
  #   mail to: user.email, subject: I18n.t('sessions.passw_reset', brand: BRANDNAME.capitalize)
  # end
  #
  # def welcome(user, subdomain)
  #   @user = user
  #   @subdomain = subdomain
  #   mail to: user.email, subject: I18n.t('sessions.welcome', brand: BRANDNAME.capitalize)
  # end
end