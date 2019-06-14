class Favlist < ApplicationRecord
  validates :name, uniqueness: {case_sensitive: false}
  belongs_to :user
  has_and_belongs_to_many :properties, -> {distinct}
  # This is basically :dependant => :destroy for HABTM associations.
  # Reference: https://stackoverflow.com/a/9206730/178728
  before_destroy { properties.clear }

  # Returns a list of objects containing the favlists. If a +property_id+ param is given, then is also checks if
  # that property is contained in the given favlist
  scope :with_param, -> (user_id, property_id) do
    favlists = Array.new
    User.find(user_id).favlists.find_each do |favlist|
      # Building a hash conditionally. Reference: https://stackoverflow.com/a/5751839/178728
      favlists << {id: favlist.id, name: favlist.name, isFaved: (favlist.has_faved?(property_id) if property_id)}.compact
    end
    favlists
  end

  # Checks if a single property is faved by a particular favlist
  def has_faved?(property_id)
    properties.exists?(property_id)
  end
end
