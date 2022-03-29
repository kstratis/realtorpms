require "active_support/core_ext/integer/time"

def session_data(request)
  session_key = Rails.application.config.session_options[:key]
  request.cookie_jar.signed_or_encrypted[session_key] || {}
end

user = lambda do |request|
  begin
    session_stored_userid = session_data(request)["user_id"]
    u = User.find(session_stored_userid )
    "#{u.first_name.first}.#{u.last_name}"
  rescue
    'Anonymous'
  end
end

Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded any time
  # it changes. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # Enable/disable caching. By default caching is disabled.
  # Run rails dev:cache to toggle caching.
  if Rails.root.join('tmp', 'caching-dev.txt').exist?
    config.action_controller.perform_caching = true
    config.action_controller.enable_fragment_cache_logging = true

    config.cache_store = :memory_store
    config.public_file_server.headers = {
      'Cache-Control' => "public, max-age=#{2.days.to_i}"
    }
  else
    config.action_controller.perform_caching = false

    config.cache_store = :null_store
  end

  # Store uploaded files on the local file system (see config/storage.yml for options).
  config.active_storage.service = :local

  # Don't overwrite files on update action (Rails 6).
  # See this: https://github.com/rails/rails/issues/35817#issuecomment-628654948
  config.active_storage.replace_on_assign_to_many = false

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  config.action_mailer.perform_caching = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise exceptions for disallowed deprecations.
  config.active_support.disallowed_deprecation = :raise

  # Tell Active Support which deprecation messages to disallow.
  config.active_support.disallowed_deprecation_warnings = []

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Suppress logger output for asset requests.
  config.assets.quiet = true

  config.log_tags = [ :subdomain, user ]

  config.action_dispatch.tld_length = 1
  # Raises error for missing translations

  # config.i18n.raise_on_missing_translations = true  # Rails 6.0
  # config.action_view.raise_on_missing_translations = true # Rails 6.1

  # Rails 6.1
  # config.action_view.annotate_rendered_view_with_filenames = true

  # Use an evented file watcher to asynchronously detect changes in source code,
  # routes, locales, etc. This feature depends on the listen gem.
  config.file_watcher = ActiveSupport::EventedFileUpdateChecker

  config.action_mailer.default_url_options = { :host => "lvh.me:3000" }
  config.action_mailer.delivery_method = :smtp
  # config.action_mailer.smtp_settings = {
  #     address: 'smtp.sendgrid.net',
  #     port: 587,
  #     domain: "dev.#{BRANDNAME}.io",
  #     user_name: Rails.application.credentials.dig(:sendgrid, :username),
  #     password: Rails.application.credentials.dig(:sendgrid, :password),
  #     authentication: :plain,
  #     enable_starttls_auto: true
  # }
  config.action_mailer.smtp_settings = {:address => 'localhost', :port => 1025 }

  # config.hosts << /(?:[a-zA-Z]+\.+)*lvh\.me/
  config.hosts << '.lvh.me'

  # Uncomment if you wish to allow Action Cable access from any origin.
  # config.action_cable.disable_request_forgery_protection = true
end
