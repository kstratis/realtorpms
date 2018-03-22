options = {
    key: '_propertyx_session'
}

case Rails.env
  when 'development', 'test'
    options.merge!(domain: 'lvh.me')
  when 'production'
    # There was no value here
    # I added lvh.me so that it runs on my local machine
    # Should be changed however in production
    options.merge!(domain: 'lvh.me')
  # TBA
end

Propertyx::Application.config.session_store :cookie_store, options
