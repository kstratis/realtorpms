# Preview all emails at http://lvh.me:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview

  # Preview this email at
  # http://lvh.me:3000/rails/mailers/user_mailer/account_activation
  # def account_activation
  #   user = User.first
  #   user.activation_token = User.new_token
  #   UserMailer.account_activation(user)
  # end

  # Preview this email at
  # http://lvh.me:3000/rails/mailers/user_mailer/password_reset
  def password_reset
    user = User.first
    subdomain = Account.find(1).subdomain
    user.reset_token = User.new_token
    UserMailer.password_reset(user, subdomain)
  end

  # Preview this email at
  # http://lvh.me:3000/rails/mailers/user_mailer/welcome
  def welcome
    user = User.second
    subdomain = Account.find(1).subdomain
    UserMailer.welcome(user, subdomain)
  end
end