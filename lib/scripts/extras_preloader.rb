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
  %w(gas solar_water_heating furnished fireplace awnings clima security_door pool elevator no_utility_bills fit_for_professional_use parking load_ramp service_lift alarm equipment balcony investment).each do |extra|
    Extra.create!(name: extra, subtype: 'other')
  end
  %w(roofdeck plot garden storage ).each do |extra|
    Extra.create!(name: extra, subtype: 'dependent')
  end
  %w(asphalt sidewalk cobblestone dirt_road sea other no_access).each do |extra|
    Extra.create!(name: extra, subtype: 'access')
  end
  %w(one_phase three_phase industrial).each do |extra|
    Extra.create!(name: extra, subtype: 'power')
  end
  %w(plane inclining amphitheatrical).each do |extra|
    Extra.create!(name: extra, subtype: 'slope')
  end
  %w(residential agricultural commercial industrial recreational unincorporated).each do |extra|
    Extra.create!(name: extra, subtype: 'zone')
  end
end

puts 'All good'



