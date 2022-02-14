# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


# The create! method is just like the create method, except it raises an exception
# for an invalid user rather than returning false

# Users
# This is a +superuser+ - sysadmin
superuser = User.create!(first_name: 'Konstantinos',
                         last_name: 'Stratis',
                         email: 'konos5@gmail.com',
                         phone1: '6972500361',
                         dob: Date.new(1986, 4, 5),
                         password: '989492ks',
                         password_confirmation: '989492ks')

# This is the owner I use for the first account
tonystark = User.create!(first_name: 'Tony',
                         last_name: 'Stark',
                         email: 'tstark@gmail.com',
                         phone1: '6945567345',
                         dob: Date.new(1976, 2, 3),
                         password: 'abc123abc',
                         password_confirmation: 'abc123abc')

# Owner of +bluedomain+
hulkhogan = User.create!(first_name: 'Hulk',
                         last_name: 'Hogan',
                         email: 'hh@gmail.com',
                         phone1: '6935567342',
                         dob: Date.new(1980, 4, 1),
                         password: 'abc123abc',
                         password_confirmation: 'abc123abc')

# Owner of +reddomain+
johnymnemonic = User.create!(first_name: 'Johny',
                             last_name: 'Mnemonic',
                             email: 'jm@gmail.com',
                             phone1: '6901560342',
                             dob: Date.new(1969, 12, 17),
                             password: 'abc123abc',
                             password_confirmation: 'abc123abc')

# This the first account and belongs to Tony Stark (tstark@gmail.com) - regular admin
demo = Account.create!(
    subdomain: 'demo',
    name: 'Demo',
    email_confirmed: true,
    owner: User.second,
    flavor: :greek
)
demo.model_types.find_by(name: 'users').users << tonystark

# This account belongs to Hulk Hogan (hh@gmail.com)
bluedomain = Account.create!(
    subdomain: 'bluedomain',
    name: 'Bluedomain',
    email_confirmed: true,
    owner: User.third,
    flavor: :greek
)
bluedomain.model_types.find_by(name: 'users').users << hulkhogan

# This account belongs to Johny Mnemonic (jm@gmail.com)
reddomain = Account.create!(
    subdomain: 'reddomain',
    name: 'Reddomain',
    email_confirmed: true,
    owner: User.fourth,
    flavor: :international
)
reddomain.model_types.find_by(name: 'users').users << johnymnemonic


lamprini = Location.find(106314) # Lamprini - Galatsi (level 3)
palatiani = Location.find(117003) # Palatiani - Ilion (level 3)
perissos = Location.find(106289) # Perissos - N.Ionia (level 3)
acton = Location.find(5056) # London - Acton (level 3) - INT
brussels = Location.find(5007) # Brussels - Belgium (level 3) - INT

# ---------------------------------------------------------

# 2 memorable +demo+ users
# -------------------------
regulardemouser1 = User.create!(first_name: 'Will',
                                last_name: 'Smith',
                                email: 'wm@gmail.com',
                                password: 'abc123abc',
                                password_confirmation: 'abc123abc')

regulardemouser2 = User.create!(first_name: 'John',
                                last_name: 'Travolta',
                                email: 'jt@gmail.com',
                                password: 'abc123abc',
                                password_confirmation: 'abc123abc')
# -------------------------
#
# 1 memorable bluedomain user
regularbluedomainuser1 = User.create!(first_name: 'Lakis',
                                      last_name: 'Gavalas',
                                      email: 'lg@gmail.com',
                                      password: 'abc123abc',
                                      password_confirmation: 'abc123abc')

# ----------------------------------------------------------

demo.users << regulardemouser1
demo.model_types.find_by(name: 'users').users << regulardemouser1

demo.users << regulardemouser2
demo.model_types.find_by(name: 'users').users << regulardemouser2

bluedomain.users << regularbluedomainuser1
bluedomain.model_types.find_by(name: 'users').users << regularbluedomainuser1

# Johny Mnemonic is invited as a regular user in Tony Stark's +demo+ account
# At the same time he remains the owner of +reddomain+
demo.users << johnymnemonic
demo.model_types.find_by(name: 'users').users << johnymnemonic

50.times do |n|
  Client.create!(first_name: Faker::Name.first_name,
                 last_name: Faker::Name.last_name,
                 email: "democlient-#{n + 1}@gmail.com",
                 telephones: "69#{rand(0..9)}76548#{rand(0..9)}#{rand(0..9)}",
                 account: demo,
                 model_type: demo.model_types.find_by(name: 'clients'))

end

10.times do |n|
  Client.create!(first_name: Faker::Name.first_name,
                 last_name: Faker::Name.last_name,
                 email: "democlient-#{n + 1}@gmail.com",
                 telephones: "69#{rand(0..9)}76548#{rand(0..9)}#{rand(0..9)}",
                 account: bluedomain,
                 model_type: bluedomain.model_types.find_by(name: 'clients'))

end

# 99 random users belonging to +demo+ account
99.times do |n|
  first_name = Faker::Name.first_name
  last_name = Faker::Name.last_name
  email = "demouser-#{n + 1}@gmail.com"
  dob = rand(10.years).seconds.ago
  phone1 = "69#{rand(0..9)}76548#{rand(0..9)}#{rand(0..9)}"
  password = 'abc123abc'
  user = User.create!(first_name: first_name,
                      last_name: last_name,
                      email: email,
                      password: password,
                      password_confirmation: password)
  demo.users << user
  demo.model_types.find_by(name: 'users').users << user
end

# 20 random users belonging to +bluedomain+ account
20.times do |n|
  first_name = Faker::Name.first_name
  last_name = Faker::Name.last_name
  email = "bluedomainuser-#{n + 1}@gmail.com"
  dob = rand(10.years).seconds.ago
  phone1 = "69#{rand(0..9)}76548#{rand(0..9)}#{rand(0..9)}"
  password = 'abc123abc'
  user = User.create!(first_name: first_name,
                      last_name: last_name,
                      email: email,
                      password: password,
                      password_confirmation: password)
  bluedomain.users << user
  bluedomain.model_types.find_by(name: 'users').users << user
end

# 20 Fake properties belonging to +regulardemouser1+ (demo account)
20.times do |n|
  property = Property.create!(
      title: Faker::TvShows::SiliconValley.motto,
      description: Faker::TvShows::SiliconValley.quote,
      businesstype: :rent,
      category: Category.find((5..32).to_a.sample),
      size: rand(25..500),
      price: rand(100..3000),
      bedrooms: rand(1..5),
      floor: rand(0..10),
      construction: rand(1970..2018),
      account: demo,
      location: perissos,
      model_type: demo.model_types.find_by(name: 'properties')
  )
  property.avatar.attach(
      io: File.open(Dir["#{ENV['MEDIA_DIR']}#{rand(1..5)}/*"].sample),
      filename: "file-#{Faker::Number.number(digits: 4)}.png"
  )
  regulardemouser1.properties << property
  demo.clients.first.properties << property
end

# 20 Fake properties belonging to +regulardemouser1+ & +regulardemouser2+(demo account)
30.times do |n|
  property = Property.create!(
      title: Faker::TvShows::SiliconValley.motto,
      description: Faker::TvShows::SiliconValley.quote,
      businesstype: :sell,
      category: Category.find((5..32).to_a.sample),
      size: rand(25..5000),
      price: rand(5000..5000000),
      bedrooms: rand(1..5),
      floor: rand(0..10),
      construction: rand(1970..2018),
      account: demo,
      location: lamprini,
      model_type: demo.model_types.find_by(name: 'properties')
  )
  property.avatar.attach(
      io: File.open(Dir["#{ENV['MEDIA_DIR']}#{rand(1..5)}/*"].sample),
      filename: "file-#{Faker::Number.number(digits: 4)}.png"
  )
  regulardemouser1.properties << property
  regulardemouser2.properties << property
  demo.clients.second.properties << property
  Cpa.where(property: property, client: [demo.clients.second.id]).update_all(ownership: true)
end

# 20 Fake properties belonging to +regulardemouser1+ (demo account)
2.times do |n|
  property = Property.create!(
      title: Faker::TvShows::SiliconValley.motto,
      description: Faker::TvShows::SiliconValley.quote,
      businesstype: :sell_rent,
      category: Category.find((5..32).to_a.sample),
      size: rand(25..5000),
      price: rand(5000..5000000),
      bedrooms: rand(1..5),
      floor: rand(0..10),
      construction: rand(1970..2018),
      account: demo,
      location: lamprini,
      model_type: demo.model_types.find_by(name: 'properties')
  )

  property.avatar.attach(
      io: File.open(Dir["#{ENV['MEDIA_DIR']}#{rand(1..5)}/*"].sample),
      filename: "file-#{Faker::Number.number(digits: 4)}.png"
  )
  regulardemouser1.properties << property
  demo.clients.third.properties << property
  Cpa.where(property: property, client: [demo.clients.third.id]).update_all(ownership: true)
end

# 5 fake properties belonging to +regularbluedomainuser1+ (bluedomain account)
5.times do |n|
  property = Property.create!(
      title: Faker::Lorem.word,
      description: Faker::Lorem.paragraph,
      businesstype: [:sell, :rent, :sell_rent].sample,
      category: Category.find((5..32).to_a.sample),
      size: Faker::Number.number(digits: 3),
      price: Faker::Number.number(digits: 6),
      bedrooms: rand(1..5),
      account: bluedomain,
      location: palatiani,
      model_type: bluedomain.model_types.find_by(name: 'properties')

  )
  property.avatar.attach(
      io: File.open(Dir["#{ENV['MEDIA_DIR']}#{rand(1..5)}/*"].sample),
      filename: "file-#{Faker::Number.number(digits: 4)}.png"
  )
  regularbluedomainuser1.properties << property
  bluedomain.clients.first.properties << property
  Cpa.where(property: property, client: [bluedomain.clients.first.id]).update_all(ownership: true)
end

