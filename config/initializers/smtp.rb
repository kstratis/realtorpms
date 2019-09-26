ActionMailer::Base.smtp_settings = {
    address: 'smtp.sendgrid.net',
    port: 587,
    domain: "dev.#{BRANDNAME}.io",
    user_name: Rails.application.credentials.dig(:sendgrid, :username),
    password: Rails.application.credentials.dig(:sendgrid, :password),
    authentication: :login,
    enable_starttls_auto: true
}