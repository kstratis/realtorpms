ActiveRecord::Base.transaction do
  %w(neoclassical protected_pr loft_pr traditional villa_pr stone studio_pr prefabricated_pr precast_pr).each do |extra|
    Extra.create!(name: extra, subtype: 'housetype')
  end
  %w(central prive).each do |extra|
    Extra.create!(name: extra, subtype: 'heating')
  end
  %w(front_facing bright corner internal).each do |extra|
    Extra.create!(name: extra, subtype: 'orientation')
  end
  %w(sea_view mountain_view forest_view infinite_view).each do |extra|
    Extra.create!(name: extra, subtype: 'view')
  end
end



