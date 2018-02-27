xlsx = Roo::Spreadsheet.open("#{Rails.root.join('lib', 'scripts', 'areas_listing.xlsx')}")
sheet = xlsx.sheet('Geographies')

myvar = 0
Country.create!(name: 'Greece', initials: 'GR', continent: 'EU')
ActiveRecord::Base.transaction do
  sheet.each_with_index do |row, index|
    next if index == 0
    begin
      c = Country.find_by(name: 'Greece')
      Location.create!(area_id: row[0].to_i,
                       localname: row[1].to_s,
                       globalname: row[2].to_s,
                       level: row[3].to_i,
                       parent_id: row[4] ? row[4].to_i : nil,
                       country: c)
      pp "Level 1, Row No #{index}, Data: #{row} - OK!"
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
