FactoryBot.define do

  factory :propertysequence, :class => Property do

    sequence(:description) { |n| "propertyNew#{n}" }
    sequence(:price) { |n| "5000#{n}" }
    sequence(:size) { |n| "12#{n}" }

    # https://stackoverflow.com/a/10847095/178728
    before(:create) do |property|
      property.account = Account.find_by_subdomain!('test1')
      # FactoryBot.find(:account, property: propertysequence)
    end

  end
end