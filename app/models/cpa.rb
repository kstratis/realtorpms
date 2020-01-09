class Cpa < ApplicationRecord

  # CPA stands for Client-Property-Association (many-to-many join table)
  belongs_to :account, optional: true # not really optional here but helps the reusability of addremoveassociations
  belongs_to :client
  belongs_to :property
  belongs_to :user, optional: true

end
