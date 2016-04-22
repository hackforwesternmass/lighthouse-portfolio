object false

child @action_items => :all do
  attribute :id, :due_date, :owner_name, :description, :completed
end

child @complete => :complete do
  attribute :id, :due_date, :owner_name, :description, :completed
end

child @incomplete => :incomplete do
  attribute :id, :due_date, :owner_name, :description, :completed
end
  