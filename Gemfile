source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 6.1'
# gem 'rails', :git => 'https://github.com/rails/rails'

# Watch out! - Don't upgrade to 3.1.13 yet because it incurs severe performance degradation
gem 'bcrypt', '3.1.12'

# gem 'bootstrap', '~> 4.4.1'

gem 'bootsnap', '~> 1.7.5'

gem 'e2mmap'

gem 'rack-cors'

gem 'image_processing', '~> 1.12.1'

# -----------

gem 'rake', '~> 13'

gem 'sprockets-rails', '3.2.2'

# image metadata info
gem 'exifr', '~> 1.3', '>= 1.3.5'

# PDF generation tool
gem 'grover'

# image manipulation tool
gem "mini_magick"

# Use postgresql as the database for Active Record
gem 'pg', '~> 1.2.3'
# Use Puma as the app server
gem 'puma', '~> 5.3.2'
# Use SCSS for stylesheets
# gem 'sass-rails', '~> 5.0.7'
gem 'sassc-rails', '~> 2.1.2'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '~> 4.2'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 5.0'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5.2.1'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.11'

# gem 'jquery-rails', '~> 4.4.0'

gem 'faker', '~> 2.18'

gem 'will_paginate', '~> 3.3.0'

gem 'pagy'

gem 'active_record_union', '~> 1.3.0'

gem 'bootstrap-will_paginate', '1.0.0'

gem 'launchy', '2.5.0'

gem 'react_on_rails', '12.4.0'

gem 'webpacker', '~> 5.4.0'

gem "roo", "~> 2.8.3"

gem "aws-sdk-s3", require: false

gem "irb"

gem 'activerecord-import'

gem 'nokogiri', '~> 1.12'

gem 'capistrano', '~> 3.16'
gem 'capistrano-rails', '~> 1.6.1'
gem 'capistrano-passenger', '~> 0.2.1'
gem 'capistrano-rbenv', '~> 2.2.0'

gem 'friendly_id', '~> 5.4'
gem 'public_uid' # Need this for pseudorandom ids

# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'
gem 'listen', '~> 3.5.1'
# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development
gem 'capistrano-rails-console', require: false

gem 'rubocop', require: false
gem 'rubocop-rails', require: false
gem 'rubocop-rspec', require: false

group :development, :test do
  gem 'rspec-rails', '5.0.1'
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 3.35.0'
  gem 'selenium-webdriver'
  gem 'email_spec', '2.2.0'
  gem 'phantomjs'
  gem 'poltergeist'
  gem 'database_cleaner'
  gem 'spring-commands-rspec'
  gem "better_errors", '~> 2.9.1'
  gem "binding_of_caller"

  # Pry REPL and friends
  gem 'pry-rails', '~> 0.3.9'
  gem 'pry-byebug', '~> 3.9'
  gem 'pry-doc', '~> 1.1'

end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console', '~> 4.1'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.1'
end

group :test do
  gem 'factory_bot_rails', '~> 6.2'
  gem 'shoulda-matchers', '~> 4.5.1'
  gem 'rspec-collection_matchers'
  gem 'rails-controller-testing', '1.0.5'
  gem 'minitest-reporters',       '1.4.3'
  gem 'guard',                    '2.17'
  gem 'guard-minitest',           '2.4.6'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

gem 'mini_racer', platforms: :ruby


gem "noticed", "~> 1.4"
