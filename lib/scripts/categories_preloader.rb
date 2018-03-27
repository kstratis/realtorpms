xlsx = Roo::Spreadsheet.open("#{Rails.root.join('lib', 'scripts', 'categories_listing.xlsx')}")
sheet = xlsx.sheet('Categories')

myvar = 0
ActiveRecord::Base.transaction do
  sheet.each_with_index do |row, index|
    next if index == 0
    begin
      Category.create!(localname: row[0].to_s,
                       globalname: row[1].to_s,
                       parent_localname: row[2].to_s,
                       parent_globalname: row[3].to_s)
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
