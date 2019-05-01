require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Propertyx
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.2
    config.i18n.default_locale = :el
    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}')]
    # This loads the Robot font family
    config.assets.paths << Rails.root.join('app', 'assets', 'fonts')
    # config.assets.paths << Rails.root.join('lib', 'assets')
    # config.assets.paths << Rails.root.join('lib', 'assets', '**', '*.{js}')
    # config.assets.paths << Rails.root.join('node_modules')
    # puts config.assets.paths

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

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
  end
end
