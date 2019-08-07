FactoryBot.define do

  factory :propertysequence, :class => Property do
    businesstype { [:sell, :rent, :sell_rent].sample }
    category { [:residential, :commercial, :land, :other].sample }
    subcategory { [:apartment, :studio, :maisonette, :detached_house, :villa, :loft, :bungalow, :building, :apartment_complex,
                   :office, :public_store, :warehouse, :industrial_space, :craft_space, :hotel, :business_building, :hall, :showroom,
                   :land_plot, :parcels, :island, :other_categories,
                   :parking, :business, :prefabricated, :detachable, :air, :other_various].sample }
    sequence(:description) { |n| "propertyNew#{n}" }
    sequence(:price) { |n| "5000#{n}" }
    sequence(:size) { |n| "12#{n}" }

    # This basically allows us to pass an account as a parameter
    transient do
      account { Account.first }
    end

    # https://stackoverflow.com/a/10847095/178728
    before(:create) do |property, evaluator|
      property.account = evaluator.account
      # FactoryBot.find(:account, property: propertysequence)
    end

  end
end