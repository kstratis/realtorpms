xlsx = Roo::Spreadsheet.open("#{Rails.root.join('lib', 'scripts', 'spitogatos.xlsx')}")
sheet = xlsx.sheet('Geographies')

myvar = 0

sheet.each_with_index do |row, index|
  next if index == 0
  level = row[3].to_i
  case level
    when 1
      RootArea.create!(area_id: row[0].to_i,
                       localname: row[1].to_s,
                       globalname: row[2].to_s)
      pp "Level 1 - #{row} - OK!"
    when 2
      # RootArea.find_by(area_id: row[4].to_i).branch_areas <<
      BranchArea.create!(area_id: row[0].to_i,
                       localname: row[1].to_s,
                       globalname: row[2].to_s)
      pp "Level 2 - #{row} - GOOD!"
    when 3
      pp "Level 3 - #{row}"
    else
      puts 'Error - No level found. Exiting'
      exit(1)
  end
  myvar+=1
end
  # pp row[0]

puts "-=Total number of rows was: #{myvar}=-"
