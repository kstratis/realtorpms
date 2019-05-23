options = {
    key: '_propertyx_session'
}

case Rails.env
  when 'development', 'test'
    options.merge!(domain: 'lvh.me')
  when 'production'
    # TBA
    options.merge!(domain: 'dev.landia.io', tld_length: 2)
end

Propertyx::Application.config.session_store :cookie_store, options
Propertyx::Application.config.secret_key_base = 'abc123'
