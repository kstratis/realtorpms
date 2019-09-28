class Log < ApplicationRecord
  belongs_to :account
  belongs_to :user, optional: true
  belongs_to :property, optional: true
  belongs_to :client, optional: true
  belongs_to :author, optional: true, class_name: 'User'
end
