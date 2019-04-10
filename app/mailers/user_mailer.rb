class UserMailer < ApplicationMailer

  # def account_activation(user)
  #   @user = user
  #   mail to: user.email, subject: "Account activation"
  # end

  def password_reset(user, subdomain)
    @user = user
    @subdomain = subdomain
    mail to: user.email, subject: "Password reset"
  end
end