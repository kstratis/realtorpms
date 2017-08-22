FactoryGirl.define do
  factory :account do
    subdomain 'test1'
    association :owner, :factory => :user
  end
end
