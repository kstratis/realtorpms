source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.2.3'
# gem 'rails', :git => 'https://github.com/rails/rails'
# gem 'bootstrap-sass', '3.3.7'
gem 'bcrypt', '3.1.13'
# gem 'babel-transpiler'

gem 'bootstrap', '~> 4.3.1'

gem 'bootsnap'
# gem 'bootstrap-datepicker-rails'
gem 'rake', '~> 12.3.3'

# image metadata info
gem 'exifr', '~> 1.3', '>= 1.3.5'

# PDF generation tool
gem 'grover'

# image manipulation tool
gem "mini_magick"

# Use postgresql as the database for Active Record
gem 'pg', '~> 1.1.4'
# Use Puma as the app server
gem 'puma', '~> 4'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0.7'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '~> 4.1.20'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 5.0'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5.2'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.9'

gem 'jquery-rails', '~> 4.3.5'

gem 'faker', '~> 2.1.0'

gem 'will_paginate', '~> 3.1.7'

gem 'active_record_union', '~> 1.3.0'

gem 'bootstrap-will_paginate', '1.0.0'

gem 'launchy', '2.4.3'

gem 'rails_12factor'

# gem 'font-awesome-rails'

gem 'react_on_rails', '11.3'

gem 'webpacker', '~> 4.0'

gem "roo", "~> 2.8.2"

gem "aws-sdk-s3", require: false

gem "parsley-rails"

gem "irb"

gem 'capistrano', '~> 3.11'
gem 'capistrano-rails', '~> 1.4'
gem 'capistrano-passenger', '~> 0.2.0'
gem 'capistrano-rbenv', '~> 2.1', '>= 2.1.4'

# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

group :development, :test do
  gem 'factory_bot'
  gem 'rspec-rails', '3.8.2'
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara'
  gem 'selenium-webdriver'
  gem 'email_spec', '2.2.0'
  gem 'phantomjs'
  gem 'poltergeist'
  gem 'database_cleaner'
  gem 'spring-commands-rspec'
  gem "better_errors"
  gem "binding_of_caller"
  gem 'listen', '>= 3.1.5', '< 3.2'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console', '>= 3.7.0'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.1'
end

group :test do
  gem 'rails-controller-testing', '1.0.4'
  gem 'minitest-reporters',       '1.3.6'
  gem 'guard',                    '2.15'
  gem 'guard-minitest',           '2.4.6'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

gem 'mini_racer', platforms: :ruby

