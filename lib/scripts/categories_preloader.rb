xlsx = Roo::Spreadsheet.open("#{Rails.root.join('lib', 'scripts', 'categories_listing.xlsx')}")
sheet = xlsx.sheet('Categories_minimal')

myvar = 0
ActiveRecord::Base.transaction do
  sheet.each_with_index do |row, index|
    next if index == 0
    begin
      Category.create!(name: row[0].to_s,
                       parent_name: row[1].to_s)
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
