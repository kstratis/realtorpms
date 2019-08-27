module CategoryFinder
  extend ActiveSupport::Concern

  def get_initial_category(category_param, sizemin_param, sizemax_param)
    # Initialized property type is 'building'
    if category_param
      %w(land other).include?(category_param) ? 'land' : 'building'
    elsif sizemin_param
      %w(land other).include?(sizemin_param) ? 'land' : 'building'
    elsif sizemax_param
      %w(land other).include?(sizemax_param) ? 'land' : 'building'
    else
      'building'
    end
  end
end
