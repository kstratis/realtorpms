
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


# The create! method is just like the create method, except it raises an exception
# for an invalid user rather than returning false

# Owners
# This is a +superuser+
superuser = User.create!(first_name: 'Konstantinos',
                         last_name: 'Stratis',
                         email: 'konos5@gmail.com',
                         phone1: '6972500361',
                         dob: Date.new(1986, 4, 5),
                         password: '989492ks',
                         password_confirmation: '989492ks',
                         admin: true)

# This is the owner I use
tonystark = User.create!(first_name: 'Tony',
                         last_name: 'Stark',
                         email: 'tstark@gmail.com',
                         phone1: '6945567345',
                         dob: Date.new(1976, 2, 3),
                         password: 'abc123',
                         password_confirmation: 'abc123',
                         admin: false)

# Owner of +bluedomain+
hulkhogan = User.create!(first_name: 'Hulk',
                         last_name: 'Hogan',
                         email: 'hh@gmail.com',
                         phone1: '6935567342',
                         dob: Date.new(1980, 4, 1),
                         password: 'abc123',
                         password_confirmation: 'abc123',
                         admin: false)

# Owner of +reddomain+
johnymnemonic = User.create!(first_name: 'Johny',
                             last_name: 'Mnemonic',
                             email: 'jm@gmail.com',
                             phone1: '6901560342',
                             dob: Date.new(1969, 12, 17),
                             password: 'abc123',
                             password_confirmation: 'abc123',
                             admin: false)

# This account belongs to Tony Stark (tstark@gmail.com)
shakalaka = Account.create!(
    subdomain: 'shakalaka',
    name: 'Shakalaka',
    owner: User.second
)

# This account belongs to Hulk Hogan (hh@gmail.com)
bluedomain = Account.create!(
    subdomain: 'bluedomain',
    name: 'Bluedomain',
    owner: User.third
)

# This account belongs to Johny Mnemonic (jm@gmail.com)
reddomain = Account.create!(
    subdomain: 'reddomain',
    name: 'Reddomain',
    owner: User.fourth
)

lamprini = Location.find(106314) # Lamprini - Galatsi (level 3)
palatiani = Location.find(117003) # Palatiani - Ilion (level 3)
perissos = Location.find(106289) # Perissos - N.Ionia (level 3)
acton = Location.find(5056) # London - Acton (level 3) - INT
brussels = Location.find(5007) # Brussels - Belgium (level 3) - INT

# ---------------------------------------------------------

# 2 memorable shakalaka users
# -------------------------
regularshakalakauser1 = User.create!(first_name: 'Will',
                                     last_name: 'Smith',
                                     email: 'wm@gmail.com',
                                     password: 'abc123',
                                     password_confirmation: 'abc123',
                                     admin: false)

regularshakalakauser2 = User.create!(first_name: 'John',
                                     last_name: 'Travolta',
                                     email: 'jt@gmail.com',
                                     password: 'abc123',
                                     password_confirmation: 'abc123',
                                     admin: false)
# -------------------------
#
# 1 memorable bluedomain user
regularbluedomainuser1 = User.create!(first_name: 'Lakis',
                                      last_name: 'Gavalas',
                                      email: 'lg@gmail.com',
                                      password: 'abc123',
                                      password_confirmation: 'abc123',
                                      admin: false)

# ----------------------------------------------------------

shakalaka = Account.find_by(subdomain: 'shakalaka')
bluedomain = Account.find_by(subdomain: 'bluedomain')

shakalaka.users << regularshakalakauser1
shakalaka.users << regularshakalakauser2
bluedomain.users << regularbluedomainuser1
# Johny Mnemonic is invited as a regular user in Tony Stark's +shakalaka+ account
# At the same time he remains the owner of +reddomain+
shakalaka.users << johnymnemonic

# 99 random users belonging to +shakalaka+ account
99.times do |n|
  first_name = Faker::Name.first_name
  last_name = Faker::Name.last_name
  email = "shakalakauser-#{n + 1}@gmail.com"
  dob = rand(10.years).seconds.ago
  phone1 = "69#{rand(0..9)}76548#{rand(0..9)}#{rand(0..9)}"
  password = 'abc123'
  user = User.create!(first_name: first_name,
                      last_name: last_name,
                      email: email,
                      password: password,
                      password_confirmation: password)
  shakalaka.users << user
end

# 20 random users belonging to +bluedomain+ account
20.times do |n|
  first_name = Faker::Name.first_name
  last_name = Faker::Name.last_name
  email = "bluedomainuser-#{n + 1}@gmail.com"
  dob = rand(10.years).seconds.ago
  phone1 = "69#{rand(0..9)}76548#{rand(0..9)}#{rand(0..9)}"
  password = 'abc123'
  user = User.create!(first_name: first_name,
                      last_name: last_name,
                      email: email,
                      password: password,
                      password_confirmation: password)
  bluedomain.users << user
end

categories = Property.categories.keys
subcategories = Property.subcategories.keys
# 20 Fake properties belonging to +regularshakalakauser1+ (shakalaka account)
20.times do |n|
  property = Property.create!(
      title: Faker::TvShows::SiliconValley.motto,
      description: Faker::TvShows::SiliconValley.quote,
      businesstype: [:sell, :rent, :sell_rent].sample,
      category: categories.sample,
      subcategory: subcategories.sample,
      size: Faker::Number.number(digits: 3),
      price: Faker::Number.number(digits: 6),
      account: shakalaka,
      location: lamprini,
      landlord: Landlord.create!(first_name: Faker::Name.first_name,
                           last_name: Faker::Name.last_name,
                           email: Faker::TvShows::SiliconValley.email,
                           telephones: Faker::PhoneNumber.phone_number)
  )
  regularshakalakauser1.properties << property
end

# 5 fake properties belonging to +regularbluedomainuser1+ (bluedomain account)
5.times do |n|
  property = Property.create!(
      title: Faker::Lorem.word,
      description: Faker::Lorem.paragraph,
      businesstype: [:sell, :rent, :sell_rent].sample,
      category: categories.sample,
      subcategory: subcategories.sample,
      size: Faker::Number.number(digits: 3),
      price: Faker::Number.number(digits: 6),
      account: bluedomain,
      location: palatiani,
      landlord: Landlord.create!(first_name: Faker::Name.first_name,
                           last_name: Faker::Name.last_name,
                           email: Faker::TvShows::SiliconValley.email,
                           telephones: Faker::PhoneNumber.phone_number)
  )
  regularbluedomainuser1.properties << property
end

