namespace :deploy do
  namespace :db do
    desc "Load the database schema if needed"
    task seed: [:environment] do
      on primary :db do
        if not test(%Q[[ -e "#{shared_path.join(".schema_loaded")}" ]])
          within release_path do
            with rails_env: fetch(:rails_env) do
              sh 'rails runner ./lib/scripts/areas_preloader.rb'
              sh 'rails runner ./lib/scripts/categories_preloader.rb'
              sh 'rails runner ./lib/scripts/extras_preloader.rb' # Load any extras
              execute :rake, "db:seed"
              # execute :ra, "../../scripts/categories_preloader.rb"
              execute :touch, shared_path.join(".schema_loaded")
              # execute :touch, shared_path.join(".schema_loaded")
            end
          end
        end
      end
    end
  end
  after "deploy:db:load", "deploy:db:seed"
end