class CalendarEvent < ApplicationRecord
  belongs_to :user

  scope :this_month, -> { where(created_for: Time.current.beginning_of_month..Time.current.end_of_month) }

  scope :with_year_and_month, lambda { |year, month|
    date = DateTime.new(year, month)
    where(created_for: date...date.next_month)
  }

  attribute :path, :string
end
