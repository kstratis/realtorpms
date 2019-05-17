# config valid for current version and patch releases of Capistrano
lock "~> 3.11.0"

set :application, "propertyx"
set :repo_url, "git@gitlab.com:konos5/propertyx.git"

# Deploy to the user's home directory
set :deploy_to, "/home/deploy/projects/#{fetch :application}"

append :linked_dirs, 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', '.bundle', 'public/system', 'public/uploads'

# Only keep the last 2 releases to save disk space
set :keep_releases, 2

before "deploy:assets:precompile", "deploy:yarn_install"

namespace :deploy do
  desc 'Run rake yarn:install'
  task :yarn_install do
    on roles(:web) do
      within release_path do
        execute("cd #{release_path} && yarn install")
      end
    end
  end
end

namespace :deploy do
  namespace :db do
    desc "Load the database schema if needed"
    task load: [:set_rails_env] do
      on primary :db do
        if not test(%Q[[ -e "#{shared_path.join(".schema_loaded")}" ]])
          within release_path do
            with rails_env: fetch(:rails_env) do
              execute :rake, "db:schema:load RAILS_ENV=production"
              execute :touch, shared_path.join(".schema_loaded")
            end
          end
        end
      end
    end
  end

  before "deploy:migrate", "deploy:db:load"
end




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
