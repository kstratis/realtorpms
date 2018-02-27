nodes = [
  {id: 1, name: 'A', parent_id: nil},
  {id: 2, name: 'B', parent_id: 1},
  {id: 3, name: 'C', parent_id: 1},
  {id: 4, name: 'D', parent_id: 2},
  {id: 5, name: 'E', parent_id: 4},
  {id: 6, name: 'F', parent_id: 3},
  {id: 7, name: 'G', parent_id: nil}
]

puts nodes

puts '---------------------------'

tree = {}
# `nodes` = the array of hashes
nodes.each do |node|
  # reject iterates though all the attributes of a hash
  tree[node[:id]] = node.reject { |k, v| k == :id }
end

pp tree
