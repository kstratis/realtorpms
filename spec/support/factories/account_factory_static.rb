FactoryGirl.define do
  factory :account do
    subdomain 'test1'
    association :owner, :factory => :user
  end

  factory :account2, :class => Account do
    subdomain 'test2'
    association :owner, :factory => :user2
  end

  factory :account3, :class => Account do
    subdomain 'test3'
    association :owner, :factory => :user3
  end
end
