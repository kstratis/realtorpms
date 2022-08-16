puts 'I AM THE SCRIPT'

ActiveRecord::Base.transaction do
  %w(neoclassical protected_pr loft_pr traditional villa_pr stone studio_pr prefabricated_pr precast_pr new_development penthouse unfinished renovated).each do |extra|
    Extra.create!(name: extra, subtype: 'housetype')
  end
  %w(sea_view mountain_view forest_view infinite_view).each do |extra|
    Extra.create!(name: extra, subtype: 'view')
  end
  %w(solar_water_heating furnished fireplace awnings clima security_door pool elevator no_utility_bills fit_for_professional_use parking load_ramp service_lift alarm equipment investment within_urban_plan agricultural_use exchange_scheme night_power heating_under_floor facade double_frontage corner internal no_agent_fee pest_net double_glass fresh_paint_coat structured_wiring accessible_for_disabled internal_staircase attic playroom pending_renovation satellite_antenna pets_allowed luxurious bright student_friendly second_home).each do |extra|
    Extra.create!(name: extra, subtype: 'other')
  end
  %w(roofdeck plot garden storage balcony).each do |extra|
    Extra.create!(name: extra, subtype: 'dependent')
  end
  %w(residential agricultural commercial industrial recreational unincorporated).each do |extra|
    Extra.create!(name: extra, subtype: 'zone')
  end
end

puts 'All good'



