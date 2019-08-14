xlsx = Roo::Spreadsheet.open("#{Rails.root.join('lib', 'scripts', 'categories_listingv2.xlsx')}")
sheet = xlsx.sheet('Categories')

myvar = 0
ActiveRecord::Base.transaction do
  sheet.each_with_index do |row, index|
    next if index == 0
    begin
      Category.create!(id: row[0].to_i,
                       localname: row[1].to_s,
                       globalname: row[2].to_s,
                       level: row[3].to_i,
                       parent_id: row[4] ? row[4].to_i : nil,
                       parent_localname: row[5] ? row[5].to_s : nil,
                       parent_globalname: row[6] ? row[6].to_s : nil)
      pp "Categories, Row No #{index}, Data: #{row} - OK!"
      myvar+=1
    rescue => e
      puts "An error occured: #{e.message}"
      exit(1)
    end
  end
end

puts '--------------------------------------'
puts "-=Total number of rows parsed: #{myvar}=-"
puts '--------------------------------------'
