class RemoveLocationIndex < ActiveRecord::Migration[5.2]
  def change
    remove_index "locations", name: "index_locations_on_id"
  end
end
