class Ilocation < ApplicationRecord
  include Searchable

  belongs_to :account
  has_many :properties

  attr_searchable %w(area)
end
