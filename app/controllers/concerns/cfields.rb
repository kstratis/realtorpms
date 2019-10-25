module Cfields
  extend ActiveSupport::Concern

  def get_cfields(name)
    current_account.model_types.find_by(name: name).fields.map { |field| {:"#{field.slug}" => field} }
  end

  # Filters any custom fields
  def cfields_filtering(name, entity, filters = {})
    initial_cfields = Hash.new
    cfields_dump = get_cfields(name)
    cfields_raw = filters.keys.grep(/^cfield_/)
    puts 'POPOPOPOPOPOPO'
    puts entity.inspect
    if cfields_raw.any?
      cfields = cfields_raw.map { |cfield| cfield.to_s.split('_')[1..].join('_') }
      cfields.each do |cfield|
        entry = Hash[cfield, filters["cfield_#{cfield}"]]
        initial_cfields[cfield] = entry
        cfield_type = cfields_dump.select { |cf| cf[cfield.to_sym] ? cf[cfield.to_sym] : nil }.first[cfield.to_sym].field_type
        case cfield_type
        when 'dropdown', 'check_box'
          puts "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD"
          entity = entity.where('preferences @> ?', entry.to_json)
        when 'text_field'
          puts "tttttttttttttttttttttttttttttttttttttttttttttttt"
          entity = entity.where("preferences ->> ? ilike '%#{filters["cfield_#{cfield}"]}%'", cfield)
        else
          'Error filter - contact support'
        end
      end
    end
    return entity, initial_cfields
  end

end
