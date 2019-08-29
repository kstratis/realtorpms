namespace :deploy do
  namespace :db do
    desc "Drops the database"
    task drop: [:set_rails_env] do
      on primary :db do
        within release_path do
          with rails_env: fetch(:rails_env) do
            execute :rake, "db:drop"
          end
        end
      end
    end
  end
end
