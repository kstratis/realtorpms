xlsx = Roo::Spreadsheet.open("#{Rails.root.join('lib', 'scripts', 'spitogatos.xlsx')}")
sheet = xlsx.sheet('Geographies')

myvar = 0

sheet.each_with_index do |row, index|
  next if index == 0
  case row[3].to_i
    when 1
      pp "Level 1 - #{row}"
    when 2
      pp "Level 2 - #{row}"
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
