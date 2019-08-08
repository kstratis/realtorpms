class RemoveErroneousRef < ActiveRecord::Migration[5.2]
  def change
    remove_reference :accounts, :landlord, index: true
  end
end
