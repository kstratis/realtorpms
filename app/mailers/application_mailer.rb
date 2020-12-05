class ApplicationMailer < ActionMailer::Base
  default from: "info@#{BRANDNAME}.io"
  layout 'mailer'
end
