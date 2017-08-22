FactoryGirl.define do
  factory :user do
    email 'user-demo@example.com'
    first_name 'user_first_name'
    last_name 'user_last_name'
    password 'abc123'
  end
end