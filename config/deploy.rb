# config valid for current version and patch releases of Capistrano
lock "~> 3.16.0"

set :application, "realtorpms"
set :repo_url, "git@github.com:kstratis/realtorpms.git"

# Deploy to the user's home directory
set :deploy_to, "/home/deploy/projects/#{fetch :application}"

# set :rails_env, Rails.env

append :linked_dirs, 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'public/packs', 'vendor/bundle', '.bundle', 'public/system', 'public/uploads'

# Only keep the last 2 releases to save disk space
set :keep_releases, 2

# Sets environ
set :default_environment, {
  'DISABLE_DATABASE_ENVIRONMENT_CHECK' => '1'
}

##
# Rbenv Setup
set :rbenv_type, :system
set :rbenv_ruby, '2.7.5'
rbenv_prefix = [
  "RBENV_ROOT=#{fetch(:rbenv_path)}",
  "RBENV_VERSION=#{fetch(:rbenv_ruby)} #{fetch(:rbenv_path)}/bin/rbenv exec"
]
set :rbenv_prefix, rbenv_prefix.join(' ')
set :rbenv_map_bins, %w(rake gem bundle ruby rails)
set :bundle_binstubs, -> { shared_path.join('bin') }


# Configure 'whenever'
vars = lambda do
  "'environment=#{fetch :whenever_environment}" \
  "&rbenv_root=#{fetch :rbenv_custom_path}" \
  "&rbenv_version=#{fetch :rbenv_ruby}'"
end
set :whenever_variables, vars

# set :linked_files, %w{config/master.key}

# Optionally, you can symlink your database.yml and/or secrets.yml file from the shared directory during deploy
# This is useful if you don't want to use ENV variables
# append :linked_files, 'config/database.yml', 'config/secrets.yml'

# #############################################################################

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, "/var/www/my_app_name"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# append :linked_files, "config/database.yml"

# Default value for linked_dirs is []
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
# set :keep_releases, 5

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure
