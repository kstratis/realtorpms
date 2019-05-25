options = {
    key: '_landia_session'
}

case Rails.env
  when 'development', 'test'
    options.merge!(domain: 'lvh.me', tld_length: 1)
  when 'staging'
    options.merge!(domain: 'dev.landia.io', tld_length: 2)
  when 'production'
    options.merge!(domain: 'landia.io', tld_length: 1)
end

Propertyx::Application.config.session_store :cookie_store, options
Propertyx::Application.config.secret_key_base = 'abc123'
