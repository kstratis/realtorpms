namespace :deploy do
  namespace :db do
    desc "Load the database schema if needed"
    task seed: [:environment] do
      on primary :db do
        if not test(%Q[[ -e "#{shared_path.join(".schema_loaded")}" ]])
          within release_path do
            # with rails_env: fetch(:rails_env) do
            execute :rails, "../../scripts/categories_preloader.rb"
            execute :touch, shared_path.join(".schema_loaded")
              # execute :touch, shared_path.join(".schema_loaded")
            # end
          end
        end
      end
    end
  end
  before "deploy:migrate", "deploy:db:load"
end