class InvitationMailer < ApplicationMailer

  def invite(invitation)
    @invitation = invitation
    mail(to: invitation.email, subject: "Invitation to join the #{invitation.account.subdomain} domain on Landia")
  end

end
