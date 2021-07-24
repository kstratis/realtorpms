class InvitationMailer < ApplicationMailer

  def invite(invitation)
    @invitation = invitation
    mail(to: invitation.email, subject: I18n.t('emails.invites.subject',
                                               subdomain: invitation.account.subdomain,
                                               brand: BRANDNAME))
  end
end
