object false

child @parents => :parents do
  attributes :id, :full_name
end

node :studentParentIds do
  @student_parent_ids
end
