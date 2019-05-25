namespace :deploy do
  namespace :db do
    desc "Preloads all the seed data"
    task seed: [:set_rails_env] do
      on primary :db do
        if not test(%Q[[ -e "#{shared_path.join(".seed_loaded")}" ]])
          within release_path do
            with rails_env: fetch(:rails_env) do
              execute :rake, "./lib/scripts/areas_preloader.rb"
              execute :rake, "./lib/scripts/categories_preloader.rb"
              execute :rake, "./lib/scripts/extras_preloader.rb" # Load any extras
              execute :rake, "db:seed"
              # execute :ra, "../../scripts/categories_preloader.rb"
              execute :touch, shared_path.join(".seed_loaded")
              # execute :touch, shared_path.join(".schema_loaded")
            end
          end
        end
      end
    end
  end
  after "deploy:db:load", "deploy:db:seed"
end