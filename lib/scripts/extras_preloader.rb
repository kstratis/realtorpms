ActiveRecord::Base.transaction do
  %w(neoclassical protected_pr loft_pr traditional villa_pr stone studio_pr prefabricated_pr precast_pr).each do |extra|
    Extra.create!(name: extra)
  end
end



