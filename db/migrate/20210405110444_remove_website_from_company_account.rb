class RemoveWebsiteFromCompanyAccount < ActiveRecord::Migration[6.1]
  def change
    remove_column :accounts, :website
  end
end
