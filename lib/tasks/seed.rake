namespace :db do
  namespace :fixtures do
    desc "Preloads all the fixtures: areas, extras and categories"
    task :preload => :environment do
      sh "bundle exec rails runner #{Rails.root.join('lib', 'scripts', 'extras_preloader.rb')}"
      sh "bundle exec rails runner #{Rails.root.join('lib', 'scripts', 'categories_preloader.rb')}"
      sh "bundle exec rails runner #{Rails.root.join('lib', 'scripts', 'areas_preloader.rb')}"
    end
  end
end
