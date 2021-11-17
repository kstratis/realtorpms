class Notification < ApplicationRecord
  include Noticed::Model
  belongs_to :recipient, polymorphic: true
  belongs_to :account

  scope :unread, -> { where read_at: nil }
end
