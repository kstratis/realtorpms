# Preview all emails at http://localhost:3000/rails/mailers/invitation
class InvitationPreview < ActionMailer::Preview

  # Preview this email at
  # http://lvh.me:3000/rails/mailers/user_mailer/welcome
  def welcome
    user = User.first
    subdomain = Account.find(1).subdomain
    UserMailer.welcome(user, subdomain)
  end

end
