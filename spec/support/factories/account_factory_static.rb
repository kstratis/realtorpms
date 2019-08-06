FactoryBot.define do
  factory :account do
    subdomain { 'test1' }
    name { 'test1' }
    association :owner, :factory => :owner
  end

  factory :account2, :class => Account do
    subdomain { 'test2' }
    name { 'test2' }
    association :owner, :factory => :user2
  end

  factory :account3, :class => Account do
    subdomain { 'test3' }
    name { 'test3' }
    association :owner, :factory => :user3
  end
end


# FactoryBot.define do
#   factory :account do
#     subdomain 'reddomain'
#     # sequence(:name) { |n| "Test Project #{n}" }
#     # description "Sample project for testing purposes"
#     # due_on 1.week.from_now
#     # association :owner
#
#     trait :due_yesterday do
#       due_on 1.day.ago
#     end
#
#     trait :due_today do
#       due_on Date.current.in_time_zone
#     end
#
#     trait :due_tomorrow do
#       due_on 1.day.from_now
#     end
#   end
# end