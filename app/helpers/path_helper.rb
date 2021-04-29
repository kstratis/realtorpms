module PathHelper
  def path_printer(path)
    root_path = '<li><a href="/"><i class="fas fa-home"> </i></a></li>'
    partial_paths = []
    path.each do |entry|
      partial_paths.push(entry == path.last ? "<li class='active'><span>#{t entry[:title]}</span></li>" : "<li class='active'><span>#{t entry[:title]}</span></li>")
    end
    root_path + partial_paths.join
  end
end
