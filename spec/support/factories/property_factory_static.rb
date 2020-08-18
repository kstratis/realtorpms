FactoryBot.define do

  factory :property, :class => Property do
    businesstype { [:sell, :rent, :sell_rent].sample }
    description { Faker::Movies::Ghostbusters.quote }

    category { FactoryBot.create(:category) }
    location { FactoryBot.create(:location) }

    size {rand(25..5000)}
    price { rand(5000..5000000) }
    bedrooms {rand(1..5)}
    floor { rand(0..10) }
    construction {rand(1970..2018) }

    before(:create) do |property, evaluator|
      property.account = evaluator.account
      property.model_type = evaluator.account.model_types.find_by(name: 'properties')
    end

  end

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
      property.model_type = evaluator.account.model_types.find_by(name: 'properties')
      # property.category = evaluator.category
      # FactoryBot.find(:account, property: propertysequence)
    end

  end
end