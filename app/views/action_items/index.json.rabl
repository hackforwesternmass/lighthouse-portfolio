object false

child @complete => :complete do
  attribute :id, :due_date, :owner_name, :description
end

child @incomplete => :incomplete do
  attribute :id, :due_date, :owner_name, :description
end
  