class Assignment < ApplicationRecord
  belongs_to :user
  belongs_to :property
  # This makes assignments unique. It means that a property can't be assigned
  # to a user more than once (or vice-versa). https://stackoverflow.com/a/315821/178728
  validates_uniqueness_of :property_id, :scope => :user_id
end
