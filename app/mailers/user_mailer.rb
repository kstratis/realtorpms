class UserMailer < ApplicationMailer

  # def account_activation(user)
  #   @user = user
  #   mail to: user.email, subject: "Account activation"
  # end

  def password_reset(user, subdomain)
    @user = user
    @subdomain = subdomain
    mail to: user.email, subject: I18n.t('sessions.passw_reset', brand: BRANDNAME.capitalize)
  end

  def welcome(user, subdomain)
    @user = user
    @subdomain = subdomain
    mail to: user.email, subject: I18n.t('sessions.welcome', brand: BRANDNAME.capitalize)
  end
end