FactoryGirl.define do

  factory :user, aliases: [:owner] do
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

  factory :user3, :class => User do
    email 'third.account.owner@example.com'
    first_name 'Hulk'
    last_name 'Hogan'
    password 'abc123'
  end

  factory :userExternal, :class => User do
    email 'external@example.com'
    first_name 'Johny'
    last_name 'Mnemonic'
    password 'abc123'
  end

  factory :usersequence, :class => User do
    sequence(:email) { |n| "user#{n}@hotmail.com" }
    sequence(:first_name) { |n| "John#{n}" }
    sequence(:last_name) { |n| "Smith#{n}" }
    password 'abc123'
  end



end