class Favorite < ApplicationRecord
  belongs_to :user
  belongs_to :property, counter_cache: true
end
