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
User.create!(first_name: 'Konstantinos',
             last_name: 'Stratis',
             email: 'konos5@gmail.com',
             password: '989492ks',
             password_confirmation: '989492ks',
             admin: true)

User.create!(first_name: 'Tony',
             last_name: 'Stark',
             email: 'tstark@gmail.com',
             password: 'abc123',
             password_confirmation: 'abc123',
             admin: false)

User.create!(first_name: 'Hulk',
             last_name: 'Hogan',
             email: 'hh@gmail.com',
             password: 'abc123',
             password_confirmation: 'abc123',
             admin: false)

User.create!(first_name: 'Johny',
             last_name: 'Mnemonic',
             email: 'jm@gmail.com',
             password: 'abc123',
             password_confirmation: 'abc123',
             admin: false)

# This account belongs to tstark@gmail.com
Account.create!(
    subdomain: 'shakalaka',
    owner: User.second
)

# This account belongs to hh@gmail.com
Account.create!(
    subdomain: 'bluedomain',
    owner: User.third
)

# This account belongs to jm@gmail.com
Account.create!(
    subdomain: 'reddomain',
    owner: User.fourth
)

l1 = Location.find_by(area_id: 106314) # Lamprini - Galatsi
l2 = Location.find_by(area_id: 117003) # Palatiani - Ilion
l3 = Location.find_by(area_id: 106289) # Perissos - N.Ionia

# ---------------------------------------------------------

# 2 memorable shakalaka users
# -------------------------
specialuser1 = User.create!(first_name: 'Will',
                            last_name: 'Smith',
                            email: 'wm@gmail.com',
                            password: 'abc123',
                            password_confirmation: 'abc123',
                            admin: false)

specialuser2 = User.create!(first_name: 'John',
                            last_name: 'Travolta',
                            email: 'jt@gmail.com',
                            password: 'abc123',
                            password_confirmation: 'abc123',
                            admin: false)
# -------------------------
#
# 1 memorable bluedomain user
specialuser3 = User.create!(first_name: 'Lakis',
                            last_name: 'Gavalas',
                            email: 'lg@gmail.com',
                            password: 'abc123',
                            password_confirmation: 'abc123',
                            admin: false)

# ----------------------------------------------------------

shakalaka = Account.find_by(subdomain: 'shakalaka')
bluedomain = Account.find_by(subdomain: 'bluedomain')

shakalaka.users << specialuser1
shakalaka.users << specialuser2
bluedomain.users << specialuser3

# 99 fake users for shakalaka account
99.times do |n|
  first_name = Faker::Name.first_name

  last_name = Faker::Name.last_name
  email = "user-#{n + 1}@gmail.com"
  password = 'abc123'
  user = User.create!(first_name: first_name,
                      last_name: last_name,
                      email: email,
                      password: password,
                      password_confirmation: password)
  shakalaka.users << user
end

# --------------------------------------
# Lets create some fake property owners
# 20.times do |n|
  # first_name = Faker::Name.first_name
  # last_name = Faker::Name.last_name
  # email = "owner-#{n + 1}@gmail.com"
  # telephones = Faker::PhoneNumber.phone_number

  # propery_owner = Owner.create!(first_name: Faker::Name.first_name,
  #                               last_name: Faker::Name.last_name,
  #                               email: "owner-#{n + 1}@gmail.com",
  #                               telephones: Faker::PhoneNumber.phone_number)
  # shakalaka.users << property_owner
# end



smithuser = shakalaka.users.find_by(email: 'wm@gmail.com')

# 20 Fake properties belonging to specialuser1 (shakalaka account)
20.times do |n|
  property = Property.create!(
      title: Faker::SiliconValley.motto,
      description: Faker::SiliconValley.quote,
      businesstype: 'sell',
      category: 'residential',
      subcategory: 'apartment',
      size: Faker::Number.number(3),
      price: Faker::Number.number(6),
      account: shakalaka,
      location: l1,
      owner: Owner.create!(first_name: Faker::Name.first_name,
                           last_name: Faker::Name.last_name,
                           email: Faker::SiliconValley.email,
                           telephones: Faker::PhoneNumber.phone_number)
  )
  smithuser.properties << property
end

# specialuser3 belonging to the bluedomain account
lguser = bluedomain.users.find_by(email: 'lg@gmail.com')

# 5 fake properties belonging to specialuser3 (bluedomain account)
5.times do |n|
  property = Property.create!(
      title: Faker::Lorem.word,
      description: Faker::Lorem.paragraph,
      businesstype: 'rent',
      category: 'residential',
      subcategory: 'apartment',
      size: Faker::Number.number(3),
      price: Faker::Number.number(6),
      account: shakalaka,
      location: l2,
      owner: Owner.create!(first_name: Faker::Name.first_name,
                                  last_name: Faker::Name.last_name,
                                  email: Faker::SiliconValley.email,
                                  telephones: Faker::PhoneNumber.phone_number)
  )
  lguser.properties << property
end

