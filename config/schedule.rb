set :output, "#{path}/log/cron.log"

every 1.day, at: '4:30 am' do
  runner "Account.deactivate_trials"
end

every 1.day, at: '4:45 am' do
  runner "Account.deactivate_stale_accounts"
end





