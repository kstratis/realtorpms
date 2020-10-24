options = {
    key: '_app_session'
}

case Rails.env
  when 'development', 'test'
    options.merge!(domain: DOMAIN_DEV, tld_length: 1)
  when 'staging'
    options.merge!(domain: DOMAIN_STAGING, tld_length: 2)
  when 'production'
    options.merge!(domain: DOMAIN_PRODUCTION, tld_length: 1)
end

Propertyx::Application.config.session_store :cookie_store, **options
Propertyx::Application.config.secret_key_base = Rails.application.credentials.secret_key_base
