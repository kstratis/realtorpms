module Jsonifier
  extend ActiveSupport::Concern

  # Converts an array of db entries to json consumable array of objects
  def jsonify(dataset, fields)
    list = {data: Array.new}
    dataset.each do |entry|
      list[:data] << fields.reduce({}) { |obj, element| obj.update(element => entry.send(element) )}
    end
  end
end
