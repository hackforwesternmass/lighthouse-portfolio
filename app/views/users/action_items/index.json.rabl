object false

child @action_items => :action_items do
  attribute :id, :due_date, :owner_name, :description, :completed, :archive
end

child @archived_action_items => :archived_action_items do
  attribute :id, :due_date, :owner_name, :description, :completed, :archive
end

child @complete => :complete do
  attribute :id, :due_date, :owner_name, :description, :completed, :archive
end

child @incomplete => :incomplete do
  attribute :id, :due_date, :owner_name, :description, :completed, :archive
end
