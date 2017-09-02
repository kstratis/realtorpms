FactoryGirl.define do

  factory :user do
    email 'account.owner@example.com'
    first_name 'Tony'
    last_name 'Stark'
    password 'abc123'
  end

  factory :user2, :class => User do
    email 'second.account.owner@example.com'
    first_name 'Iron'
    last_name 'Man'
    password 'abc123'
  end

end