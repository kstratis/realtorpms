FactoryBot.define do
  factory :country, :class => Country do
    name { 'Greece' }
    initials { 'GR' }
    continent { 'EU' }
  end
end
