FactoryBot.define do

  factory :propertysequence, :class => Property do
    businesstype { [:sell, :rent, :sell_rent].sample }
    sequence(:description) { |n| "propertyNew#{n}" }
    sequence(:price) { |n| "5000#{n}" }
    sequence(:size) { |n| "12#{n}" }

    # This basically allows us to pass an account as a parameter
    transient do
      account { Account.first }
      category { Category.first }
      location { Location.first }
    end

    # https://stackoverflow.com/a/10847095/178728
    before(:create) do |property, evaluator|
      property.account = evaluator.account
      property.category = evaluator.category
      property.location = evaluator.location
      # property.category = evaluator.category
      # FactoryBot.find(:account, property: propertysequence)
    end

  end
end