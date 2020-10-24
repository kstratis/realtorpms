FactoryBot.define do
  factory :category, :class => Category do
    localname { 'Διαμέρισμα' }
    globalname { 'Apartment' }
    level { 2 }
    parent_id { 1 }
    parent_globalname { 'Residential' }
    slug { 'apartment' }
    parent_slug { 'residential' }
  end
end
