# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


# The create! method is just like the create method, except it raises an exception
# for an invalid user rather than returning false

User.create!(first_name:  'Konstantinos',
             last_name: 'Stratis',
             email: 'konos5@gmail.com',
             password: '989492ks',
             password_confirmation: '989492ks',
             admin: true)

99.times do |n|
  first_name  = Faker::Name.first_name

  last_name = Faker::Name.last_name
  email = "user-#{n+1}@starwars.com"
  password = 'abc123'
  User.create!(first_name: first_name,
               last_name: last_name,
               email: email,
               password:              password,
               password_confirmation: password)
end