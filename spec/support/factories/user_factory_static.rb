FactoryGirl.define do
  factory :user do
    email 'account.owner@example.com'
    first_name 'first name of account owner of test1 subdomain'
    last_name 'last name of account owner of test1 subdomain'
    password 'abc123'
    account_id :account
  end
end