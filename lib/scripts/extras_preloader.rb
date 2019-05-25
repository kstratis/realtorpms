puts 'I AM THE SCRIPT'

ActiveRecord::Base.transaction do
  %w(neoclassical protected_pr loft_pr traditional villa_pr stone studio_pr prefabricated_pr precast_pr).each do |extra|
    Extra.create!(name: extra, subtype: 'housetype')
  end
  %w(central prive).each do |extra|
    Extra.create!(name: extra, subtype: 'heating')
  end
  %w(facade double_frontage corner internal).each do |extra|
    Extra.create!(name: extra, subtype: 'orientation')
  end
  %w(sea_view mountain_view forest_view infinite_view).each do |extra|
    Extra.create!(name: extra, subtype: 'view')
  end
  %w(gas solar_water_heating furnished fireplace awnings clima security_door pool no_elevator no_utility_bills fit_for_professional_use parking).each do |extra|
    Extra.create!(name: extra, subtype: 'other')
  end
  %w(roofdeck plot garden storage ).each do |extra|
    Extra.create!(name: extra, subtype: 'dependent')
  end
end

puts 'All good'



