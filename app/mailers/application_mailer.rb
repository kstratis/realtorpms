class ApplicationMailer < ActionMailer::Base
  default from: "info@#{BRANDNAME.downcase}.io"
  layout 'mailer'
end
