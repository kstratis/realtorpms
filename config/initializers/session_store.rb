options = {
    key: '_propertyx_session'
}

case Rails.env
  when 'development', 'test'
    options.merge!(domain: 'lvh.me')
  when 'production'
    # TBA
    # options.merge!(domain: 'lvh.me')
end

Propertyx::Application.config.session_store :cookie_store, options
