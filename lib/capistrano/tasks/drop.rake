namespace :deploy do
  namespace :db do
    desc "Drops the database"
    task drop: [:set_rails_env] do
      on primary :db do
        within release_path do
          with rails_env: fetch(:rails_env) do
            puts "Database removed"
            execute :rake, "db:drop"
            puts "Database removed"
          end
        end
      end
    end
  end
end