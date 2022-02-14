class Location < ApplicationRecord
  include Searchable

  belongs_to :country
  has_many :properties

  attr_searchable %w(localname globalname)
end
