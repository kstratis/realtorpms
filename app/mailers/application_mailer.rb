class ApplicationMailer < ActionMailer::Base
  default from: "info@#{BRANDNAME.downcase}.com"
  layout 'mailer'
end
