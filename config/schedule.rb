set :output, "#{path}/log/cron.log"

every 1.day, at: '4:30 am' do
  runner "Account.deactivate_trials"
end

every 1.day, at: '4:45 am' do
  runner "Account.deactivate_stale_accounts"
end

every 30.minutes do
  runner "Spitogatos.create_listings"
end

every 20.minutes do
  runner "Spitogatos.edit_listings"
end

every 10.minutes do
  runner "Spitogatos.delete_listings"
end

every 8.hours do
  runner "Spitogatos.renew_listings"
end



