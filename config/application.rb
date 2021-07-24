require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Propertyx
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0
    config.i18n.default_locale = :en
    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}')]
    config.assets.paths << Rails.root.join('app', 'assets', 'fonts')

    config.action_mailer.preview_path = "#{Rails.root}/spec/mailers/previews"
    # The following works but is not optimal
    # config.autoloader = :classic

    # The following were found on the internet and don't work
    # config.eager_load_paths << "#{config.root}/spec/mailers/previews"
    # config.eager_load_paths += %W[#{config.root}/lib]

    config.generators do |g|
      g.test_framework :rspec,
      fixtures: true,
      view_specs: false,
      helper_specs: false,
      routing_specs: false
    end

    config.action_view.embed_authenticity_token_in_remote_forms = true

    # Removes the wrapping .field_with_errors divs when a form has errors
    ActionView::Base.field_error_proc = Proc.new do |html_tag, instance|
      html_tag.html_safe
    end



    # config.logger = Logger.new("#{Rails.root}/log/app.log")
    # config.logger.level = Logger::WARN
    # config.colorize_logging
    # config.log_level = :warn

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # -- all .rb files in that directory are automatically loaded after loading
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
  end
end
