xlsx = Roo::Spreadsheet.open("#{Rails.root.join('lib', 'scripts', 'areas_listing.xlsx')}")
sheet = xlsx.sheet('Geographies')

myvar = 0
ActiveRecord::Base.transaction do
  sheet.each_with_index do |row, index|
    next if index == 0
    level = row[3].to_i
    begin
      case level
        when 1
          RootArea.create!(area_id: row[0].to_i,
                           localname: row[1].to_s,
                           globalname: row[2].to_s)
          pp "Level 1, Row No #{index}, Data: #{row} - OK!"
        when 2
          b = BranchArea.create!(area_id: row[0].to_i,
                             localname: row[1].to_s,
                             globalname: row[2].to_s)
          r = RootArea.find_by(area_id: row[4].to_i)
          if r
            r.branch_areas << b
          else
            (branchorphans ||= []) << { "#{b.localname}": row[4].to_i }
          end

          pp "Level 2, Row No #{index}, Data: #{row} - GOOD!"
        when 3
          l = LeafArea.create!(area_id: row[0].to_i,
                           localname: row[1].to_s,
                           globalname: row[2].to_s)
          b = BranchArea.find_by(area_id: row[4].to_i)
          if b
            b.leaf_areas << l
          else
            (leaforphans ||= []) << { "#{b.localname}": row[4].to_i }
          end
          pp "Level 3, Row No #{index}, Data: #{row}"
        else
          puts 'Error - No level found. Exiting'
          exit(1)
      end
      myvar+=1
    rescue => e
      puts "An error occured: #{e.message}"
      exit(1)
    end
  end
end


  # pp row[0]
puts '--------------------------------------'
puts "-=Total number of rows was: #{myvar}=-"
puts '--------------------------------------'
puts "-=The rogue root areas are:=-"
branchorphans.each do |o|
  pp o.to_s
end
puts '--------------------------------------'
puts "-=The rogue branch areas are:=-"
leaforphans.each do |o|
  pp o.to_s
end
puts '--------------------------------------'
