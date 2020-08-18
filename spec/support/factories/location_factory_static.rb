FactoryBot.define do
  factory :location, :class => Location do
    localname { 'Κέντρο' }
    globalname { 'Center' }
    level { 3 }
    parent_id { 2723 }
    country { FactoryBot.create(:country) }
    parent_localname { 'Λαύριο' }
    parent_globalname { 'Lavrio' }
  end
end
