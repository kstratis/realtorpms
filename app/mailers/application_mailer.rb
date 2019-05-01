class ApplicationMailer < ActionMailer::Base
  default from: "info@#{BRANDNAME}.com"
  layout 'mailer'
end
