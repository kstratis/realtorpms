env :PATH, ENV['PATH']
set :output, "#{path}/log/cron.log"

every 1.day, at: '4:30 am' do
  runner "Account.deactivate_trials"
end





