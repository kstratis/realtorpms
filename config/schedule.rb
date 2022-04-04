env :PATH, ENV['PATH']
env :GEM_PATH, ENV['GEM_PATH']
env :GEM_HOME, ENV['GEM_HOME']

set :output, "#{path}/log/cron.log"

every 1.day, at: '4:30 am' do
  runner "Account.deactivate_trials"
end





