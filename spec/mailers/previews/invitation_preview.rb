# Preview all emails at http://localhost:3000/rails/mailers/invitation
class InvitationMailerPreview < ActionMailer::Preview

  # Preview this email at
  # http://lvh.me:3000/rails/mailers/invitation_mailer/invite
  def invite
    invitation = Invitation.new(id: 21, email: 'tstark@gmail.com', account_id: 1, token: 'mycustomtoken')
    InvitationMailer.invite(invitation)
  end

end
